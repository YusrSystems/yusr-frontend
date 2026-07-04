import type { BaseReportRequest } from "../../../core/data/report/baseReportRequest.ts";
import { DateService } from "yusr-ui";


export class TaxReturnReportRequest implements BaseReportRequest
{
	fromDate!: string;
	toDate!: string;

	constructor(init?: Partial<TaxReturnReportRequest>)
	{
		const today = new Date();
		const lastYear = new Date();
		lastYear.setFullYear(today.getFullYear() - 1);

		this.toDate = DateService.formatDateOnly(today);
		this.fromDate = DateService.formatDateOnly(lastYear);

		if (init)
		{
			Object.assign(this, init);
		}
	}
}
