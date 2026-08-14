import type { InvoiceItem } from "@/core/data/invoices/invoiceItem.ts";
import type { InvoiceItemProfitResult } from "@/core/data/invoices/InvoiceItemProfitResult.ts";
import type { InvoiceProfitResult } from "@/core/data/invoices/InvoiceProfitResult.ts";
import type { Voucher } from "@/core/data/voucher.ts";


export default class InvoiceItemsMath
{
	public static GetPrices(
		taxIncluded: boolean,
		price: number,
		totalTaxesPerc: number
	): { taxExclusivePrice: number; taxInclusivePrice: number; }
	{
		if (taxIncluded)
		{
			return {
				taxExclusivePrice: InvoiceItemsMath.CalcTaxExclusivePrice(price, totalTaxesPerc),
				taxInclusivePrice: price
			};
		}
		else
		{
			return {
				taxExclusivePrice: price,
				taxInclusivePrice: InvoiceItemsMath.CalcTaxInclusivePrice(price, totalTaxesPerc)
			};
		}
	}

	public static CalcTaxExclusivePrice(taxInclusivePrice: number, totalTaxesPerc: number)
	{
		return InvoiceItemsMath.round2(taxInclusivePrice / (100 + totalTaxesPerc) * 100);
	}

	public static CalcTaxInclusivePrice(taxExclusivePrice: number, totalTaxesPerc: number): number
	{
		return InvoiceItemsMath.round2(taxExclusivePrice * (100 + totalTaxesPerc) / 100);
	}

	public static CalcTaxExclusiveTotalPrice(
		taxExclusivePrice: number,
		settlement: number,
		qtn: number,
		totalTaxesPerc: number
	)
	{
		return InvoiceItemsMath.round2((taxExclusivePrice + (settlement / (100 + totalTaxesPerc) * 100)) * qtn);
	}

	public static CalcTaxInclusiveTotalPrice(taxInclusivePrice: number, settlement: number, qtn: number)
	{
		return InvoiceItemsMath.round2((taxInclusivePrice + settlement) * qtn);
	}

	public static CalcTotalCost(cost: number, qtn: number)
	{
		return InvoiceItemsMath.round2(cost * qtn);
	}

	public static CalcInvoiceTaxExclusivePrice(invoiceItems: InvoiceItem[])
	{
		return invoiceItems.reduce(
			(sum, i) =>
				sum
				+ InvoiceItemsMath.CalcTaxExclusiveTotalPrice(
					i.taxExclusivePrice.value ?? 0,
					i.settlement.value ?? 0,
					i.quantity.value ?? 0,
					i.totalTaxesPerc.value ?? 0
				),
			0
		) ?? 0;
	}

	public static CalcInvoiceTaxInclusivePrice(invoiceItems: InvoiceItem[])
	{
		let price = invoiceItems.reduce(
			(sum, i) =>
				sum
				+ InvoiceItemsMath.CalcTaxInclusiveTotalPrice(
					i.taxInclusivePrice.value ?? 0,
					i.settlement.value ?? 0,
					i.quantity.value ?? 0
				),
			0
		);
		price = price == undefined ? 0 : InvoiceItemsMath.round2(price);
		return price;
	}

	public static CalcInvoiceBaseTaxInclusivePrice(invoiceItems: InvoiceItem[])
	{
		const price = invoiceItems.reduce(
			(sum, i) => sum + ((i.taxInclusivePrice.value ?? 0) * (i.quantity.value ?? 0)),
			0
		);
		return InvoiceItemsMath.round2(price);
	}

	public static CalcInvoiceItemProfit(invoiceItem: InvoiceItem): InvoiceItemProfitResult
	{
		const taxInclusivePrice = (invoiceItem.taxInclusivePrice.value ?? 0) + (invoiceItem.settlement.value ?? 0);
		const taxFactor = (100 + invoiceItem.totalTaxesPerc.value) / 100;
		const itemTaxesAmount = InvoiceItemsMath.round2(taxInclusivePrice - (taxInclusivePrice / taxFactor));
		const profit = InvoiceItemsMath.round2(taxInclusivePrice - itemTaxesAmount - (invoiceItem.cost.value ?? 0));
		const qtn = invoiceItem.quantity.value ?? 0;
		return {
			taxInclusivePrice,
			cost: invoiceItem.cost.value ?? 0,
			totalTaxesAmount: itemTaxesAmount,
			quantity: qtn,
			profit,
			totalProfit: InvoiceItemsMath.round2(profit * qtn)
		};
	}

	public static CalcInvoiceProfit(invoiceItems: InvoiceItem[], costVouchers: Voucher[]): InvoiceProfitResult
	{
		const invoiceCostsAmount = costVouchers.reduce((sum, i) => sum + (i.amount.value ?? 0), 0) ?? 0;

		let taxInclusiveTotalPrice = 0;
		let totalCost = 0;
		let totalTaxesAmount = 0;
		let profit = 0;

		invoiceItems.forEach((i) =>
		{
			const itemProfit = InvoiceItemsMath.CalcInvoiceItemProfit(i);
			taxInclusiveTotalPrice += itemProfit.taxInclusivePrice * (itemProfit.quantity ?? 0);
			totalCost += itemProfit.cost * (itemProfit.quantity ?? 0);
			totalTaxesAmount += itemProfit.totalTaxesAmount * (itemProfit.quantity ?? 0);
			profit += itemProfit.profit * (itemProfit.quantity ?? 0);
		});

		return {
			taxInclusiveTotalPrice,
			totalCost,
			totalTaxesAmount,
			invoiceCosts: invoiceCostsAmount,
			profit: profit - invoiceCostsAmount
		};
	}

	public static CalcInvoicePaidPrice(paymentVouchers: Voucher[])
	{
		return paymentVouchers?.reduce((sum, i) => sum + (i.amount.value ?? 0), 0) ?? 0;
	}

	public static CalcInvoiceUnpaidPrice(invoiceItems: InvoiceItem[], paymentVouchers: Voucher[])
	{
		return InvoiceItemsMath.CalcInvoiceTaxInclusivePrice(invoiceItems)
			- InvoiceItemsMath.CalcInvoicePaidPrice(paymentVouchers);
	}

	private static round2(value: number): number
	{
		return value >= 0
			? Math.round((value + Number.EPSILON) * 100) / 100
			: -Math.round((-value + Number.EPSILON) * 100) / 100;
	}
}