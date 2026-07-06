export class AccountStatementReportRequest
{
	accountId!: number;
	fromDate?: string | null;
	toDate?: string | null;
	pageNumber?: number;
	rowsPerPage?: number;
	groupByDocument: boolean = true;

	constructor(init?: Partial<AccountStatementReportRequest>)
	{
		Object.assign(this, init);
	}
}