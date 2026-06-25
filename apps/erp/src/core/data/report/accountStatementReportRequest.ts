import type { BaseReportRequest } from "./baseReportRequest";


export class AccountStatementReportRequest implements BaseReportRequest
{
	accountId!: number;
	fromDate!: string;
	toDate!: string;

	constructor(init?: Partial<AccountStatementReportRequest>)
	{
		Object.assign(this, init);
	}
}
