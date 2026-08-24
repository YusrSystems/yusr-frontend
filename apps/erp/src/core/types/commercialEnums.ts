import type { TFunction } from "i18next";


export enum SalesInvoiceType
{
	Invoice = 1,
	CreditNote = 2,
	DebitNote = 3
}

export enum PurchaseInvoiceType
{
	Bill = 1,
	CreditNote = 2,
	DebitNote = 3
}

export enum QuotationStatus
{
	Active = 1,
	Converted = 2,
	Cancelled = 3
}

export function getSalesInvoiceTypeName(type: SalesInvoiceType, t?: TFunction<"accounting">): string
{
	switch (type)
	{
		case SalesInvoiceType.Invoice:
			return t ? t("invoices.sellInvoice", "فاتورة مبيعات") : "فاتورة مبيعات";
		case SalesInvoiceType.CreditNote:
			return t ? t("invoices.creditNote", "إشعار دائن (مرتجع مبيعات)") : "إشعار دائن (مرتجع مبيعات)";
		case SalesInvoiceType.DebitNote:
			return t ? t("invoices.debitNote", "إشعار مدين مبيعات") : "إشعار مدين مبيعات";
		default:
			return "";
	}
}

export function getSalesInvoiceTypeBadge(
	type: SalesInvoiceType,
	t?: TFunction<"accounting">
): { label: string; className: string }
{
	switch (type)
	{
		case SalesInvoiceType.Invoice:
			return {
				label: t ? t("invoices.invoiceBadge", "فاتورة") : "فاتورة",
				className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
			};
		case SalesInvoiceType.CreditNote:
			return {
				label: t ? t("invoices.creditNoteBadge", "إشعار دائن") : "إشعار دائن",
				className: "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
			};
		case SalesInvoiceType.DebitNote:
			return {
				label: t ? t("invoices.debitNoteBadge", "إشعار مدين") : "إشعار مدين",
				className: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
			};
	}
}

export function getPurchaseInvoiceTypeName(type: PurchaseInvoiceType, t?: TFunction<"accounting">): string
{
	switch (type)
	{
		case PurchaseInvoiceType.Bill:
			return t ? t("invoices.purchaseInvoice", "فاتورة مشتريات") : "فاتورة مشتريات";
		case PurchaseInvoiceType.CreditNote:
			return t ? t("invoices.purchaseCreditNote", "إشعار دائن (مرتجع مشتريات)") : "إشعار دائن (مرتجع مشتريات)";
		case PurchaseInvoiceType.DebitNote:
			return t ? t("invoices.purchaseDebitNote", "إشعار مدين مشتريات") : "إشعار مدين مشتريات";
		default:
			return "";
	}
}

export function getPurchaseInvoiceTypeBadge(
	type: PurchaseInvoiceType,
	t?: TFunction<"accounting">
): { label: string; className: string }
{
	switch (type)
	{
		case PurchaseInvoiceType.Bill:
			return {
				label: t ? t("invoices.billBadge", "فاتورة شراء") : "فاتورة شراء",
				className: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
			};
		case PurchaseInvoiceType.CreditNote:
			return {
				label: t ? t("invoices.purchaseCreditNoteBadge", "إشعار دائن") : "إشعار دائن",
				className: "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300"
			};
		case PurchaseInvoiceType.DebitNote:
			return {
				label: t ? t("invoices.purchaseDebitNoteBadge", "إشعار مدين") : "إشعار مدين",
				className: "bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300"
			};
	}
}

export function getQuotationStatusBadge(
	status: QuotationStatus,
	t?: TFunction<"accounting">
): { label: string; className: string }
{
	switch (status)
	{
		case QuotationStatus.Active:
			return {
				label: t ? t("quotations.statusActive", "ساري") : "ساري",
				className: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
			};
		case QuotationStatus.Converted:
			return {
				label: t ? t("quotations.statusConverted", "تمت الفوترة") : "تمت الفوترة",
				className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
			};
		case QuotationStatus.Cancelled:
			return {
				label: t ? t("quotations.statusCancelled", "ملغي") : "ملغي",
				className: "bg-zinc-100 text-zinc-800 dark:bg-zinc-950 dark:text-zinc-300"
			};
	}
}