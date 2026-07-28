import { InvoiceDto } from "@/core/data/invoices/invoice";
import { PartnerDto } from "@/core/data/partner";
import { InvoicePrintSize } from "@/core/data/setting";


export interface InvoiceReportResult
{
	invoice: InvoiceDto;
	partner: PartnerDto;
	totalBeforeTax: number;
	totalTaxAmount: number;
	totalAfterTax: number;
	paidAmount: number;
	remainingAmount: number;
	titleAr: string;
	titleEn: string;
	isSimplified: boolean;
	settlementAmount: number;
	settlementPercent: number;
	settlementReason?: string;
	qr: string;
	qrBytes: string;
	invoicePrintSize: InvoicePrintSize;
}