import { Dto, Entity } from "yusr-ui";
import type { Signal } from "@preact/signals-react";


export class DashboardSummaryDto extends Dto
{
	public netSales: number = 0;
	public netPurchases: number = 0;
	public receipts: number = 0;
	public payments: number = 0;
	public grossProfit: number = 0;
	public marginPercentage: number = 0;
	public netCashFlow: number = 0;
	public outputVat: number = 0;
	public inputVat: number = 0;
	public netVatDue: number = 0;
}

export class DashboardChartPointDto extends Dto
{
	public label: string = "";
	public netSales: number = 0;
	public netPurchases: number = 0;
	public receipts: number = 0;
	public payments: number = 0;
}

export class DashboardDataDto extends Dto
{
	public thisMonth: DashboardSummaryDto = new DashboardSummaryDto();
	public thisWeek: DashboardSummaryDto = new DashboardSummaryDto();
	public weeklyChart: DashboardChartPointDto[] = [];
	public monthlyChart: DashboardChartPointDto[] = [];
	public yearlyChart: DashboardChartPointDto[] = [];
}

export class DashboardData extends Entity<DashboardDataDto>
{
	public thisMonth: Signal<DashboardSummaryDto>;
	public thisWeek: Signal<DashboardSummaryDto>;
	public weeklyChart: Signal<DashboardChartPointDto[]>;
	public monthlyChart: Signal<DashboardChartPointDto[]>;
	public yearlyChart: Signal<DashboardChartPointDto[]>;

	constructor(dto?: Partial<DashboardDataDto>)
	{
		super(dto);

		this.thisMonth = this.assign("thisMonth", dto?.thisMonth ?? new DashboardSummaryDto());
		this.thisWeek = this.assign("thisWeek", dto?.thisWeek ?? new DashboardSummaryDto());
		this.weeklyChart = this.assign("weeklyChart", dto?.weeklyChart ?? []);
		this.monthlyChart = this.assign("monthlyChart", dto?.monthlyChart ?? []);
		this.yearlyChart = this.assign("yearlyChart", dto?.yearlyChart ?? []);
	}
}