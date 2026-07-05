export class ItemStatementReportRequest
{
	itemId!: number;
	storeId?: number | null;
	pageNumber?: number;
	rowsPerPage?: number;

	constructor(init?: Partial<ItemStatementReportRequest>)
	{
		Object.assign(this, init);
	}
}