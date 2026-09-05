export interface ItemsProfitabilityLine
{
	itemId: number;
	itemName: string;
	itemBrand: string;
	categories: string[];
	baseUnitName: string;
	soldQuantity: number;
	returnedQuantity: number;
	netQuantity: number;
	salesAmount: number;
	cogsAmount: number;
	profitAmount: number;
	marginPercentage: number;
}

export interface ItemsProfitabilityReportResult
{
	fromDate: string;
	toDate: string;
	storeId?: number;
	pageTotalSales: number;
	pageTotalCogs: number;
	pageTotalProfit: number;
	pageMarginPercentage: number;
	pageNetQuantity: number;
	lines: ItemsProfitabilityLine[];
	totalCount: number;
	pageNumber: number;
	rowsPerPage: number;
}