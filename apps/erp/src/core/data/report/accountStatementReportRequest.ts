import type { BaseReportRequest } from "./baseReportRequest";


export class AccountStatementReportRequest implements BaseReportRequest
{
	accountId!: number;
	fromDate: string | null = null;
	toDate: string | null = null;

	constructor(init?: Partial<AccountStatementReportRequest>)
	{
		Object.assign(this, init);
	}
}
