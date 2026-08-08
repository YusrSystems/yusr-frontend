export interface LowStockLine
{
	itemId: number;
	itemName: string;
	baseUnitName: string;
	minQuantityLimit?: number;
	maxQuantityLimit?: number;
	quantityInStock: number;
	suggestedReorderQty: number;
}

export interface LowStockReportResult
{
	storeId?: number;
	storeName?: string;
	lines: LowStockLine[];
	pageNumber: number;
	rowsPerPage: number;
	totalCount: number;
}