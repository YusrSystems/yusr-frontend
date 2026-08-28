import { PartnerDto } from "@/core/data/partner";
import { InvoicePrintSize } from "@/core/data/setting";
import { SalesInvoiceDto } from "@/core/data/commercial/salesInvoice";
import { PurchaseInvoiceDto } from "@/core/data/commercial/purchaseInvoice";
import { QuotationDto } from "@/core/data/commercial/quotation";


export interface IBaseCommercialReportResult
{
	partner: PartnerDto;
	totalBeforeTax: number;
	totalTaxAmount: number;
	totalAfterTax: number;
	settlementAmount: number;
	settlementPercent: number;
	settlementReason?: string;
	titleAr: string;
	titleEn: string;
	invoicePrintSize: InvoicePrintSize;
}

export interface SalesInvoiceReportResult extends IBaseCommercialReportResult
{
	invoice: SalesInvoiceDto;
	paidAmount: number;
	remainingAmount: number;
	tenderedAmount?: number;
	changeAmount?: number;
	isSimplified: boolean;
	qr?: string;
	qrBytes?: string;
}

export interface PurchaseInvoiceReportResult extends IBaseCommercialReportResult
{
	invoice: PurchaseInvoiceDto;
	paidAmount: number;
	remainingAmount: number;
}

export interface QuotationReportResult extends IBaseCommercialReportResult
{
	quotation: QuotationDto;
}

export type CommercialReportResult =
	| SalesInvoiceReportResult
	| PurchaseInvoiceReportResult
	| QuotationReportResult;

export function isSalesInvoiceReport(
	result: CommercialReportResult
): result is SalesInvoiceReportResult
{
	return "invoice" in result && "qrBytes" in result;
}

export function isPurchaseInvoiceReport(
	result: CommercialReportResult
): result is PurchaseInvoiceReportResult
{
	return "invoice" in result && !("qrBytes" in result);
}

export function isQuotationReport(
	result: CommercialReportResult
): result is QuotationReportResult
{
	return "quotation" in result;
}