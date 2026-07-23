export enum ProfitAndLossRowDocumentType
{
	Sell = 1,
	SellReturn = 2,
	Payment = 3
}

export interface SalesProfitabilityLine
{
	id: number;
	documentId: number;
	documentType: ProfitAndLossRowDocumentType;
	date: string;
	partnerName: string;
	glAccountName: string;
	description?: string;
	salesAmount: number;
	cogsAmount: number;
	directCostsAmount: number;
	netProfit: number;
}

export interface SalesProfitabilityReportResult
{
	fromDate: string;
	toDate: string;
	lines: SalesProfitabilityLine[];
	totalCount: number;
	pageTotalSales: number;
	pageTotalCogs: number;
	pageTotalDirectCosts: number;
	pageNetProfit: number;
	pageNumber: number;
	rowsPerPage: number;
}