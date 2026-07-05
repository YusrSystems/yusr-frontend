export interface BalanceSheetReportResult
{
	itemsCost: number;
	banksBalance: number;
	boxesBalance: number;
	debtorsBalance: number;
	creditorsBalance: number;
}

export function getTotalAssets(data: BalanceSheetReportResult): number
{
	return data.itemsCost + data.banksBalance + data.boxesBalance + data.debtorsBalance;
}

export function getTotalLiabilities(data: BalanceSheetReportResult): number
{
	return data.creditorsBalance;
}

export function getOwnerEquity(data: BalanceSheetReportResult): number
{
	return getTotalAssets(data) - getTotalLiabilities(data);
}