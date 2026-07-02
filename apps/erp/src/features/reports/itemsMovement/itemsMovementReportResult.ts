export enum ItemsMovementReportType
{
	ItemsMovement = 0,
	ItemsMovementGrouped = 1
}

export interface ItemsMovementReportRow
{
	id: number;
	transType: string;
	transId: number;
	transDate: string;
	itemId: number;
	itemName: string;
	cost: number;
	quantity: number;
	price: number;
	totalPrice: number;
	profit: number;
	from: string;
	to: string;
	groupField: string;
}

export interface ItemsMovementReportResult
{
	itemsMovementRows: ItemsMovementReportRow[];
	fromDate?: string;
	toDate?: string;
	fromAccount?: string;
	toAccount?: string;
	fromStore?: string;
	toStore?: string;
	itemName?: string;
	titleAr: string;
	titleEn: string;
	tableFieldTitleAr: string;
	tableFieldTitleEn: string;
	totalIncomeQtn: number;
	totalOutcomeQtn: number;
	totalIncomeAmount: number;
	totalOutcomeAmount: number;
	totalProfit: number;
	reportType: ItemsMovementReportType;

	pageNumber: number;
	rowsPerPage: number;
	totalCount: number;
}