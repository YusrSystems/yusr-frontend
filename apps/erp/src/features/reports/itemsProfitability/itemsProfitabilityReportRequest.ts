import { DateService } from "yusr-ui";


export class ItemsProfitabilityReportRequest
{
	fromDate!: string;
	toDate!: string;
	storeId?: number | null;
	storeName?: string | null;
	itemCategoryIds?: number[] | null;
	itemBrandIds?: number[] | null;
	itemIds?: number[] | null;
	pageNumber: number;
	rowsPerPage: number;

	constructor(init?: Partial<ItemsProfitabilityReportRequest>)
	{
		const now = new Date();
		const lastDayOfPrevMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
		const firstDayOfPrevMonth = new Date(lastDayOfPrevMonth.getFullYear(), lastDayOfPrevMonth.getMonth(), 1);
		this.fromDate = DateService.formatDateOnly(firstDayOfPrevMonth);
		this.toDate = DateService.formatDateOnly(lastDayOfPrevMonth);
		this.pageNumber = 1;
		this.rowsPerPage = 100;
		Object.assign(this, init);
	}
}