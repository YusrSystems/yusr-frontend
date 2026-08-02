import type { AccountDto } from "@/core/data/account.ts";
import { DocumentType } from "@/core/types/documentType.ts";


export interface AccountStatementLine
{
	id: number;
	date: string;
	documentType?: DocumentType;
	documentId: number;
	partnerName: string;
	narration: string;
	description?: string;
	debit: number;
	credit: number;
	runningBalance: number;
}

export interface AccountStatementReportResult
{
	fromDate?: string;
	toDate?: string;
	account: AccountDto;
	openingBalanceBeforePeriod: number;
	closingBalanceAfterPeriod: number;
	lines: AccountStatementLine[];

	// Pagination fields
	pageNumber: number;
	rowsPerPage: number;
	totalCount: number;
	pageTotalDebits: number;
	pageTotalCredits: number;
}
