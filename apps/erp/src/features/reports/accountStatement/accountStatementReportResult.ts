import type { AccountDto } from "@/core/data/account.ts";


export interface AccountStatementRow
{
	date: string;
	type: string;
	documentNumber: number;
	income: number;
	outcome: number;
	balance: number;
	notes: string;
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