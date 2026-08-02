import { DateService } from "yusr-ui";


export class SalesProfitabilityReportRequest
{
	fromDate!: string;
	toDate!: string;
	expenseAccountIds?: number[] | null;
	pageNumber?: number;
	rowsPerPage?: number;

	constructor(init?: Partial<SalesProfitabilityReportRequest>)
	{
		const now = new Date();
		const lastDayOfPrevMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
		const firstDayOfPrevMonth = new Date(lastDayOfPrevMonth.getFullYear(), lastDayOfPrevMonth.getMonth(), 1);

		this.fromDate = DateService.formatDateOnly(firstDayOfPrevMonth);
		this.toDate = DateService.formatDateOnly(lastDayOfPrevMonth);
		Object.assign(this, init);
	}
}