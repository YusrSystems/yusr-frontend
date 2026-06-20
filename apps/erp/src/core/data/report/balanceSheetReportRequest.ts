import type { BaseReportRequest } from "./baseReportRequest";


export class BalanceSheetReportRequest implements BaseReportRequest
{
	toDate!: string;

	constructor(init?: Partial<BalanceSheetReportRequest>)
	{
		Object.assign(this, init);
	}
}
