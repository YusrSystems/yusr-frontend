export enum ProfitAndLossRowDocumentType
{
	Sell,
	SellReturn,
	Payment,
}

export interface ProfitAndLossRow
{
	id: number;
	documentId: number;
	documentType: ProfitAndLossRowDocumentType;
	date: string;
	description?: string;

	fromName?: string;
	toName?: string;

	taxAmount: number;
	cost: number;
	amount: number;
	profit: number;
}

export interface ProfitAndLossReportResult
{
	invoiceListRows: ProfitAndLossRow[];
	fromDate?: string;
	toDate?: string;
	fromAccountId?: number;
	fromAccountName?: string;
	toAccountId?: number;
	toAccountName?: string;
	voucherCategoryIds?: number[];
	voucherCategoryNames?: string[];
	documentTypes?: ProfitAndLossRowDocumentType[];
	pageNumber: number;
	rowsPerPage: number;
	totalCount: number;
}