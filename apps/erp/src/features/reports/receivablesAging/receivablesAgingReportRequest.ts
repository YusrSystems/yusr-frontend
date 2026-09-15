import { DateService } from "yusr-ui";
import { ReceivablesAgingBucket, ReceivablesAgingViewMode } from "@/core/types/receivablesAging";


export class ReceivablesAgingReportRequest
{
	viewMode: ReceivablesAgingViewMode;
	asOfDate: string;
	partnerId?: number | null;
	partnerName?: string | null;
	storeId?: number | null;
	storeName?: string | null;
	bucketFilter?: ReceivablesAgingBucket | null;
	pageNumber: number;
	rowsPerPage: number;

	constructor(init?: Partial<ReceivablesAgingReportRequest>)
	{
		this.viewMode = ReceivablesAgingViewMode.Summary;
		this.asOfDate = DateService.formatDateOnly(new Date());
		this.pageNumber = 1;
		this.rowsPerPage = 50;
		Object.assign(this, init);
	}
}