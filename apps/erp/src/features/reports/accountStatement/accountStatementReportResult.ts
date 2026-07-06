import type { AccountDto } from "@/core/data/account.ts";
import type { FinancialLedgerDocumentType } from "@/core/data/financialLedger.ts";
import type { InvoiceType } from "@/core/types/invoiceType.ts";


export interface AccountStatementRow
{
	date: string;
	type: string;
	documentNumber: number;
	documentType?: FinancialLedgerDocumentType;
	invoiceType?: InvoiceType;
	income: number;
	outcome: number;
	balance: number;
	notes: string;
	editsCount?: number;
}

export interface AccountStatementReportResult
{
	fromDate?: string;
	toDate?: string;
	account: AccountDto;
	periodBalance: number;
	totalIncome: number;
	totalOutcome: number;
	accountStatementRows: AccountStatementRow[];

	// Pagination fields (ensure your backend returns these)
	pageNumber: number;
	rowsPerPage: number;
	totalCount: number;
}