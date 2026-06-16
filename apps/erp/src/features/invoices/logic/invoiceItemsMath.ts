import type { InvoiceItem } from "@/core/data/invoices/invoiceItem.ts";
import type { InvoiceItemProfitResult } from "@/core/data/invoices/InvoiceItemProfitResult.ts";
import type { InvoiceProfitResult } from "@/core/data/invoices/InvoiceProfitResult.ts";
import type { InvoiceVoucher } from "@/core/data/invoices/invoiceVoucher.ts";
import { InvoiceRelationType } from "@/core/data/invoiceOld.ts";


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
		return Number((taxInclusivePrice / (100 + totalTaxesPerc) * 100).toFixed(2));
	}

	public static CalcTaxInclusivePrice(taxExclusivePrice: number, totalTaxesPerc: number): number
	{
		return Number((taxExclusivePrice * (100 + totalTaxesPerc) / 100).toFixed(2));
	}

	public static CalcTaxExclusiveTotalPrice(
		taxExclusivePrice: number,
		settlement: number,
		qtn: number,
		totalTaxesPerc: number
	)
	{
		return Number(((taxExclusivePrice + (settlement / (100 + totalTaxesPerc) * 100)) * qtn).toFixed(2));
	}

	public static CalcTaxInclusiveTotalPrice(taxInclusivePrice: number, settlement: number, qtn: number)
	{
		return Number(((taxInclusivePrice + settlement) * qtn).toFixed(2));
	}

	public static CalcTotalCost(cost: number, qtn: number)
	{
		return Number((cost * qtn).toFixed(2));
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
		price = price == undefined ? 0 : Number(price.toFixed(2));
		return price;
	}

	public static CalcInvoiceItemProfit(invoiceItem: InvoiceItem): InvoiceItemProfitResult
	{
		const taxInclusivePrice = (invoiceItem.taxInclusivePrice.value ?? 0) + (invoiceItem.settlement.value ?? 0);
		const taxFactor = (100 + invoiceItem.totalTaxesPerc.value) / 100;
		const itemTaxesAmount = Number((taxInclusivePrice - (taxInclusivePrice / taxFactor)).toFixed(2));
		const profit = Number((taxInclusivePrice - itemTaxesAmount - (invoiceItem.cost.value ?? 0)).toFixed(2));
		const qtn = invoiceItem.quantity.value ?? 0;
		return {
			taxInclusivePrice: taxInclusivePrice,
			cost: invoiceItem.cost.value ?? 0,
			totalTaxesAmount: itemTaxesAmount,
			quantity: qtn,
			profit: profit,
			totalProfit: Number((profit * qtn).toFixed(2))
		};
	}

	public static CalcInvoiceProfit(invoiceItems: InvoiceItem[], invoiceCosts: InvoiceVoucher[]): InvoiceProfitResult
	{
		const invoiceCostsAmount = invoiceCosts.reduce((sum, i) => sum + (i.amount.value ?? 0), 0) ?? 0;

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
			taxInclusiveTotalPrice: taxInclusiveTotalPrice,
			totalCost: totalCost,
			totalTaxesAmount: totalTaxesAmount,
			invoiceCosts: invoiceCostsAmount,
			profit: profit
		};
	}

	public static CalcInvoicePaidPrice(invoiceVouchers: InvoiceVoucher[])
	{
		const paymentVouchers = invoiceVouchers?.filter((v) => v.invoiceRelationType.value == InvoiceRelationType.Payment) ?? [];
		return paymentVouchers?.reduce((sum, i) => sum + (i.amount.value ?? 0), 0) ?? 0;
	}

	public static CalcInvoiceUnpaidPrice(invoiceItems: InvoiceItem[], invoiceVouchers: InvoiceVoucher[])
	{
		return InvoiceItemsMath.CalcInvoiceTaxInclusivePrice(invoiceItems)
			- InvoiceItemsMath.CalcInvoicePaidPrice(invoiceVouchers);
	}
}
