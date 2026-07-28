import { DateService } from "yusr-ui";


export class VatReturnReportRequest
{
	fromDate!: string;
	toDate!: string;

	constructor(init?: Partial<VatReturnReportRequest>)
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