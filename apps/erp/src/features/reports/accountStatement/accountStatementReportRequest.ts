import { DateService } from "yusr-ui";


export class AccountStatementReportRequest
{
	glAccountId!: number;
	fromDate!: string;
	toDate!: string;
	pageNumber!: number;
	rowsPerPage!: number;

	constructor(init?: Partial<AccountStatementReportRequest>)
	{
		const now = new Date();
		const lastDayOfPrevMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
		const firstDayOfPrevMonth = new Date(lastDayOfPrevMonth.getFullYear(), lastDayOfPrevMonth.getMonth(), 1);

		this.fromDate = DateService.formatDateOnly(firstDayOfPrevMonth);
		this.toDate = DateService.formatDateOnly(lastDayOfPrevMonth);
		Object.assign(this, init);
	}
}