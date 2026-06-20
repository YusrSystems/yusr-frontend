import type { BaseReportRequest } from "./baseReportRequest";
import type { InvoiceType } from "@/core/types/invoiceType.ts";


export const InvoicesListReportType = {
	InvoicesList: 0,
	ProfitAndLoss: 1
} as const;

export type InvoicesListReportType = typeof InvoicesListReportType[keyof typeof InvoicesListReportType];

export class InvoicesListReportRequest implements BaseReportRequest
{
	reportType: InvoicesListReportType;
	types: InvoiceType[] = [];
	searchText?: string;
	fromDate?: string;
	toDate?: string;
	actionAccountId?: number;
	storeId?: number;
	itemIds?: number[];

	constructor(init?: Partial<InvoicesListReportRequest>)
	{
		this.fromDate = undefined;
		this.toDate = undefined;
		this.reportType = InvoicesListReportType.InvoicesList;
		Object.assign(this, init);
	}
}
