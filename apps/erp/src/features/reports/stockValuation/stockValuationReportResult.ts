export interface StockValuationLine
{
	itemId: number;
	itemName: string;
	categories?: string[];
	itemBrand?: string;
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