import { ReceivablesAgingBucket, ReceivablesAgingViewMode } from "@/core/types/receivablesAging";


export interface CustomerAgingSummaryLine
{
	partnerId: number;
	partnerName: string;
	partnerPhone?: string;
	partnerMobile?: string;
	current: number;
	days1To30: number;
	days31To60: number;
	days61To90: number;
	days90Plus: number;
	totalOutstanding: number;
	openInvoicesCount: number;
}

export interface InvoiceAgingDetailLine
{
	invoiceId: number;
	partnerId: number;
	partnerName: string;
	partnerPhone?: string;
	partnerMobile?: string;
	issueDate: string;
	dueDate?: string;
	fullAmount: number;
	paidAmount: number;
	creditedAmount: number;
	remainingAmount: number;
	overdueDays: number;
	bucket: ReceivablesAgingBucket;
}

export interface ReceivablesAgingReportResult
{
	viewMode: ReceivablesAgingViewMode;
	asOfDate: string;
	partnerId?: number;
	partnerName?: string;
	storeId?: number;
	storeName?: string;
	bucketFilter?: ReceivablesAgingBucket;
	totalCurrent: number;
	totalDays1To30: number;
	totalDays31To60: number;
	totalDays61To90: number;
	totalDays90Plus: number;
	grandTotalOutstanding: number;
	totalCustomersCount: number;
	totalInvoicesCount: number;
	customers: CustomerAgingSummaryLine[];
	invoices: InvoiceAgingDetailLine[];
	pageNumber: number;
	rowsPerPage: number;
	totalCount: number;
}