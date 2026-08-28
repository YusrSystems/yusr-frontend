export interface ICommercialMathLine
{
	taxExclusivePrice: number;
	taxInclusivePrice: number;
	settlement: number;
	quantity: number;
	totalTaxesPerc: number;
	cost?: number;
}

export interface ICommercialLineProfit
{
	taxInclusivePrice: number;
	cost: number;
	totalTaxesAmount: number;
	quantity: number;
	profit: number;
	totalProfit: number;
}

export interface ICommercialDocumentProfit
{
	taxInclusiveTotalPrice: number;
	totalCost: number;
	totalTaxesAmount: number;
	directCosts: number;
	profit: number;
}

export class CommercialMath
{
	public static round2(value: number): number
	{
		return value >= 0
			? Math.round((value + Number.EPSILON) * 100) / 100
			: -Math.round((-value + Number.EPSILON) * 100) / 100;
	}

	public static getTaxFactor(totalTaxesPerc: number): number
	{
		return (100 + (totalTaxesPerc || 0)) / 100;
	}

	public static calcTaxExclusivePrice(taxInclusivePrice: number, totalTaxesPerc: number): number
	{
		const factor = CommercialMath.getTaxFactor(totalTaxesPerc);
		return CommercialMath.round2(taxInclusivePrice / factor);
	}

	public static calcTaxInclusivePrice(taxExclusivePrice: number, totalTaxesPerc: number): number
	{
		const factor = CommercialMath.getTaxFactor(totalTaxesPerc);
		return CommercialMath.round2(taxExclusivePrice * factor);
	}

	public static getPrices(
		taxIncluded: boolean,
		price: number,
		totalTaxesPerc: number
	): { taxExclusivePrice: number; taxInclusivePrice: number }
	{
		if (taxIncluded)
		{
			return {
				taxExclusivePrice: CommercialMath.calcTaxExclusivePrice(price, totalTaxesPerc),
				taxInclusivePrice: price
			};
		}
		return {
			taxExclusivePrice: price,
			taxInclusivePrice: CommercialMath.calcTaxInclusivePrice(price, totalTaxesPerc)
		};
	}

	public static calcTaxExclusiveTotalPrice(
		taxExclusivePrice: number,
		settlement: number,
		quantity: number,
		totalTaxesPerc: number
	): number
	{
		const factor = CommercialMath.getTaxFactor(totalTaxesPerc);
		const unitSettlementExcl = factor > 0 ? settlement / factor : 0;
		return CommercialMath.round2((taxExclusivePrice + unitSettlementExcl) * quantity);
	}

	public static calcTaxInclusiveTotalPrice(
		taxInclusivePrice: number,
		settlement: number,
		quantity: number
	): number
	{
		return CommercialMath.round2((taxInclusivePrice + settlement) * quantity);
	}

	public static calcDocumentTaxExclusivePrice(items: ICommercialMathLine[]): number
	{
		return CommercialMath.round2(
			items.reduce(
				(sum, i) =>
					sum +
					CommercialMath.calcTaxExclusiveTotalPrice(
						i.taxExclusivePrice || 0,
						i.settlement || 0,
						i.quantity || 0,
						i.totalTaxesPerc || 0
					),
				0
			)
		);
	}

	public static calcDocumentTaxInclusivePrice(items: ICommercialMathLine[]): number
	{
		return CommercialMath.round2(
			items.reduce(
				(sum, i) =>
					sum +
					CommercialMath.calcTaxInclusiveTotalPrice(
						i.taxInclusivePrice || 0,
						i.settlement || 0,
						i.quantity || 0
					),
				0
			)
		);
	}

	public static calcDocumentBaseTaxInclusivePrice(items: ICommercialMathLine[]): number
	{
		return CommercialMath.round2(
			items.reduce((sum, i) => sum + (i.taxInclusivePrice || 0) * (i.quantity || 0), 0)
		);
	}

	public static calcLineProfit(item: ICommercialMathLine): ICommercialLineProfit
	{
		const unitPriceInc = (item.taxInclusivePrice || 0) + (item.settlement || 0);
		const factor = CommercialMath.getTaxFactor(item.totalTaxesPerc || 0);
		const unitPriceExc = factor > 0 ? unitPriceInc / factor : unitPriceInc;
		const unitTax = unitPriceInc - unitPriceExc;
		const cost = item.cost || 0;
		const unitProfit = CommercialMath.round2(unitPriceExc - cost);
		const qty = item.quantity || 0;

		return {
			taxInclusivePrice: unitPriceInc,
			cost,
			totalTaxesAmount: CommercialMath.round2(unitTax * qty),
			quantity: qty,
			profit: unitProfit,
			totalProfit: CommercialMath.round2(unitProfit * qty)
		};
	}

	public static calcDocumentProfit(
		items: ICommercialMathLine[],
		costVouchersAmount: number = 0
	): ICommercialDocumentProfit
	{
		let taxInclusiveTotalPrice = 0;
		let totalCost = 0;
		let totalTaxesAmount = 0;
		let totalProfitBeforeCosts = 0;

		items.forEach((item) =>
		{
			const lineProfit = CommercialMath.calcLineProfit(item);
			taxInclusiveTotalPrice += lineProfit.taxInclusivePrice * lineProfit.quantity;
			totalCost += lineProfit.cost * lineProfit.quantity;
			totalTaxesAmount += lineProfit.totalTaxesAmount;
			totalProfitBeforeCosts += lineProfit.totalProfit;
		});

		return {
			taxInclusiveTotalPrice: CommercialMath.round2(taxInclusiveTotalPrice),
			totalCost: CommercialMath.round2(totalCost),
			totalTaxesAmount: CommercialMath.round2(totalTaxesAmount),
			directCosts: CommercialMath.round2(costVouchersAmount),
			profit: CommercialMath.round2(totalProfitBeforeCosts - costVouchersAmount)
		};
	}
}