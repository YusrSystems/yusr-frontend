import { InvoiceType } from "@/core/types/invoiceType.ts";


export interface TaxAuditReportLine
{
	invoiceId: number;
	invoiceType: InvoiceType;
	date: string;
	partnerName: string;
	partnerVatNumber?: string;
	itemName: string;
	quantity: number;
	taxRate: number;
	taxExclusiveAmount: number;
	taxAmount: number;
	taxInclusiveAmount: number;
}

export interface TaxAuditReportResult
{
	fromDate: string;
	toDate: string;
	lines: TaxAuditReportLine[];
	pageSalesTaxExclusive: number;
	pageSalesTax: number;
	pagePurchasesTaxExclusive: number;
	pagePurchasesTax: number;
	pageNumber: number;
	rowsPerPage: number;
	totalCount: number;
}