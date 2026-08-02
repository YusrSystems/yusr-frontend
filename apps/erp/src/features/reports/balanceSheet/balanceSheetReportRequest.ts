import { DateService } from "yusr-ui";


export class BalanceSheetReportRequest
{
	asOfDate: string;

	constructor(init?: Partial<BalanceSheetReportRequest>)
	{
		this.asOfDate = DateService.formatDateOnly(new Date());
		Object.assign(this, init);
	}
}