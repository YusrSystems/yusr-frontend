export interface BalanceSheetNode
{
	glAccountId: number;
	name: string;
	balance: number;
	isParent: boolean;
	children: BalanceSheetNode[];
}

export interface BalanceSheetReportResult
{
	asOfDate: string;
	assetTree: BalanceSheetNode[];
	totalAssets: number;
	liabilityTree: BalanceSheetNode[];
	totalLiabilities: number;
	equityTree: BalanceSheetNode[];
	totalEquity: number;
	totalPriorYearsRetainedEarnings: number;
	totalCurrentYearEarnings: number;
	totalLiabilitiesAndEquity: number;
}