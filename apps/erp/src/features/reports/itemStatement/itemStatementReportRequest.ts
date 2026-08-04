import { DateService } from "yusr-ui";


export class ItemStatementReportRequest
{
	itemId!: number;
	storeId?: number;
	storeName?: string;
	fromDate!: string;
	toDate!: string;
	pageNumber?: number;
	rowsPerPage?: number;

	constructor(init?: Partial<ItemStatementReportRequest>)
	{
		const now = new Date();
		const lastDayOfPrevMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
		const firstDayOfPrevMonth = new Date(lastDayOfPrevMonth.getFullYear(), lastDayOfPrevMonth.getMonth(), 1);

		this.fromDate = DateService.formatDateOnly(firstDayOfPrevMonth);
		this.toDate = DateService.formatDateOnly(lastDayOfPrevMonth);
		Object.assign(this, init);
	}
}