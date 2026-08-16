export class LowStockReportRequest
{
	storeId?: number | null;
	storeName?: string | null;
	pageNumber: number;
	rowsPerPage: number;

	constructor(init?: Partial<LowStockReportRequest>)
	{
		this.pageNumber = 1;
		this.rowsPerPage = 100;
		Object.assign(this, init);
	}
}