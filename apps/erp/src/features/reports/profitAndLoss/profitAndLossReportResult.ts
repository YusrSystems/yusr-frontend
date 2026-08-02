export interface PlReportNode
{
	glAccountId: number;
	name: string;
	netChange: number;
	isParent: boolean;
	children: PlReportNode[];
}

export interface ProfitAndLossReportResult
{
	fromDate: string;
	toDate: string;

	revenueTree: PlReportNode[];
	totalRevenue: number;

	totalCogs: number;
	grossProfit: number;

	expenseTree: PlReportNode[];
	totalExpense: number;

	netProfit: number;
}