export interface StockValuationLine
{
	itemId: number;
	itemName: string;
	itemCategoryName?: string;
	itemBrandName?: string;
	baseUnitName: string;
	storeName: string;
	quantityOnHand: number;
	averageCost: number;
	totalValuation: number;
}

export interface StockValuationReportResult
{
	asOfDate: string;
	totalInventoryValue: number;
	lines: StockValuationLine[];
	pageNumber: number;
	rowsPerPage: number;
	totalCount: number;
}