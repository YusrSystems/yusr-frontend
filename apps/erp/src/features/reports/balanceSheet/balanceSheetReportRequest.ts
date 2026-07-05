import { DateService } from "yusr-ui";


export class BalanceSheetReportRequest
{
	toDate: string;

	constructor(init?: Partial<BalanceSheetReportRequest>)
	{
		this.toDate = DateService.formatDateOnly(new Date());
		Object.assign(this, init);
	}
}