import type { PartnerDto } from "@/core/data/partner.ts";
import { DocumentType } from "@/core/types/documentType.ts";


export interface PartnerStatementLine
{
	id: number;
	date: string;
	documentType?: DocumentType;
	documentId: number;
	narration: string;
	description?: string;
	debit: number;
	credit: number;
	runningBalance: number;
}

export interface PartnerStatementReportResult
{
	fromDate?: string;
	toDate?: string;
	partner: PartnerDto;
	openingBalanceBeforePeriod: number;
	closingBalanceAfterPeriod: number;
	lines: PartnerStatementLine[];

	pageNumber: number;
	rowsPerPage: number;
	totalCount: number;
	pageTotalDebits: number;
	pageTotalCredits: number;
}