import { Dto, Entity } from "yusr-ui";
import type { Signal } from "@preact/signals-react";


export class YearlyData
{
	public sales: number[] = [];
	public purchases: number[] = [];
	public salesReturns: number[] = [];
	public purchasesReturns: number[] = [];
	public receiptVouchers: number[] = [];
	public paymentVouchers: number[] = [];
}

export class DashboardDataDto extends Dto
{
	public weeklySales: number[] = [];
	public weeklyPurchases: number[] = [];
	public weeklyReceipts: number[] = [];
	public weeklyPayments: number[] = [];
	public monthlyData: number[] = [];
	public yearlyData: YearlyData = new YearlyData();
}

export class DashboardData extends Entity<DashboardDataDto>
{
	public weeklySales: Signal<number[]>;
	public weeklyPurchases: Signal<number[]>;
	public weeklyReceipts: Signal<number[]>;
	public weeklyPayments: Signal<number[]>;
	public monthlyData: Signal<number[]>;
	public yearlyData: Signal<YearlyData>;

	constructor(dto?: Partial<DashboardDataDto>)
	{
		super(dto);

		this.weeklySales = this.assign("weeklySales", dto?.weeklySales);
		this.weeklyPurchases = this.assign("weeklyPurchases", dto?.weeklyPurchases);
		this.weeklyReceipts = this.assign("weeklyReceipts", dto?.weeklyReceipts);
		this.weeklyPayments = this.assign("weeklyPayments", dto?.weeklyPayments);
		this.monthlyData = this.assign("monthlyData", dto?.monthlyData);
		this.yearlyData = this.assign("yearlyData", dto?.yearlyData);

	}

}
