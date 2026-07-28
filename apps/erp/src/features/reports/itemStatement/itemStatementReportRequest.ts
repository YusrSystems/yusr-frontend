export class ItemStatementReportRequest
{
	itemId!: number;
	storeId?: number;
	storeName?: string;
	pageNumber?: number;
	rowsPerPage?: number;

	constructor(init?: Partial<ItemStatementReportRequest>)
	{
		Object.assign(this, init);
	}
}