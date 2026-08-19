import { DateService } from "yusr-ui";


export class StockValuationReportRequest
{
	asOfDate: string;
	storeId?: number | null;
	itemCategoryIds?: number[] | null;
	itemBrandId?: number | null;
	pageNumber: number;
	rowsPerPage: number;

	constructor(init?: Partial<StockValuationReportRequest>)
	{
		this.asOfDate = DateService.formatDateOnly(new Date());
		this.pageNumber = 1;
		this.rowsPerPage = 100;
		Object.assign(this, init);
	}
}