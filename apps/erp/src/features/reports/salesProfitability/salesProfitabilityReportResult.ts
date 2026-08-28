import type { TFunction } from "i18next";
import { DocumentType, getDocumentRoute, getDocumentTypeName } from "@/core/types/documentType.ts";


export interface SalesProfitabilityLine
{
	id: number;
	documentId: number;
	documentType: DocumentType;
	date: string;
	partnerName: string;
	glAccountName: string;
	description?: string;
	salesAmount: number;
	cogsAmount: number;
	directCostsAmount: number;
	netProfit: number;
}

export interface SalesProfitabilityReportResult
{
	fromDate: string;
	toDate: string;
	lines: SalesProfitabilityLine[];
	totalCount: number;
	pageTotalSales: number;
	pageTotalCogs: number;
	pageTotalDirectCosts: number;
	pageNetProfit: number;
	pageNumber: number;
	rowsPerPage: number;
}

export function getProfitAndLossRowDocumentTypeName(type: DocumentType, t?: TFunction<"accounting">): string
{
	switch (type)
	{
		case DocumentType.Sales:
			return t ? t("invoices.sellInvoice") : "فاتورة مبيعات";
		case DocumentType.SalesReturn:
			return t ? t("invoices.sellReturn") : "مرتجع مبيعات";
		case DocumentType.SalesDebitNote:
			return t ? t("invoices.sellDebitNote", "إشعار مدين مبيعات") : "إشعار مدين مبيعات";
		case DocumentType.Payment:
			return t ? t("vouchers.paymentVoucher") : "سند صرف";
		case DocumentType.Receipt:
			return t ? t("vouchers.receiptVoucher") : "سند قبض";
		default:
			return getDocumentTypeName(type);
	}
}

export function getProfitAndLossRowDocumentRoute(type: DocumentType): string | undefined
{
	return getDocumentRoute(type);
}