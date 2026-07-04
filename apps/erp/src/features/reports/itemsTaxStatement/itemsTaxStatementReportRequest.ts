export enum ItemsTaxStatementReportType
{
	Sales = 0,
	Purchases = 1
}

export class ItemsTaxStatementReportRequest
{
	type: ItemsTaxStatementReportType = ItemsTaxStatementReportType.Sales;
	fromDate?: string | null;
	toDate?: string | null;
	itemIds?: number[] | null;
	pageNumber?: number;
	rowsPerPage?: number;

	constructor(init?: Partial<ItemsTaxStatementReportRequest>)
	{
		Object.assign(this, init);
	}
}