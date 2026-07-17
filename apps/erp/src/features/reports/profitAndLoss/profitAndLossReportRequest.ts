import { DateService } from "yusr-ui";
import { ProfitAndLossRowDocumentType } from "@/features/reports/profitAndLoss/profitAndLossReportResult.ts";


export class ProfitAndLossReportRequest
{
	fromDate?: string | null;
	toDate?: string | null;
	fromAccountId?: number;
	fromAccountName?: string;
	toAccountId?: number;
	toAccountName?: string;
	voucherCategoryIds?: number[];
	voucherCategoryNames?: string[];
	documentTypes?: ProfitAndLossRowDocumentType[];
	pageNumber?: number;
	rowsPerPage?: number;

	constructor(init?: Partial<ProfitAndLossReportRequest>)
	{
		const now = new Date();
		const lastDayOfPrevMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
		const firstDayOfPrevMonth = new Date(lastDayOfPrevMonth.getFullYear(), lastDayOfPrevMonth.getMonth(), 1);

		this.fromDate = DateService.formatDateOnly(firstDayOfPrevMonth);
		this.toDate = DateService.formatDateOnly(lastDayOfPrevMonth);

		Object.assign(this, init);
	}
}