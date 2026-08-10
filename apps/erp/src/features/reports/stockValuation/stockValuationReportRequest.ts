import { DateService } from "yusr-ui";


export class StockValuationReportRequest
{
	asOfDate: string;
	storeId?: number;
	categoryId?: number;
	brandId?: number;
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