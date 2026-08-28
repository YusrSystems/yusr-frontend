export enum DocumentType
{
	None = 0,
	Sales = 1,
	SalesReturn = 2,
	SalesDebitNote = 3,
	Purchase = 4,
	PurchaseReturn = 5,
	PurchaseDebitNote = 6,
	Payment = 7,
	Receipt = 8,
	BalanceTransfer = 9,
	CostAdjustment = 10,
	OpeningBalance = 11,
	ManualAdjustment = 12,
	OpeningQuantity = 13,
	ItemTransfer = 14,
	ItemsSettlement = 15,
	YearEndClosing = 16,
	VoucherDistribution = 17,
	PosSessionVariance = 18
}

const DOCUMENT_TYPE_NAMES: Record<DocumentType, string> = {
	[DocumentType.None]: "غير معروف",
	[DocumentType.Sales]: "فاتورة مبيعات",
	[DocumentType.SalesReturn]: "مرتجع مبيعات",
	[DocumentType.SalesDebitNote]: "إشعار مدين مبيعات",
	[DocumentType.Purchase]: "فاتورة مشتريات",
	[DocumentType.PurchaseReturn]: "مرتجع مشتريات",
	[DocumentType.PurchaseDebitNote]: "إشعار مدين مشتريات",
	[DocumentType.Payment]: "سند صرف",
	[DocumentType.Receipt]: "سند قبض",
	[DocumentType.BalanceTransfer]: "نقل رصيد",
	[DocumentType.CostAdjustment]: "تسوية تكلفة",
	[DocumentType.OpeningBalance]: "رصيد افتتاحي",
	[DocumentType.ManualAdjustment]: "تسوية يدوية",
	[DocumentType.OpeningQuantity]: "كمية افتتاحية",
	[DocumentType.ItemTransfer]: "نقل مواد",
	[DocumentType.ItemsSettlement]: "تسوية مواد",
	[DocumentType.YearEndClosing]: "إقفال نهاية السنة",
	[DocumentType.VoucherDistribution]: "توزيع سند دوري",
	[DocumentType.PosSessionVariance]: "تسوية صندوق نقطة البيع"
};

const DOCUMENT_ROUTES: Partial<Record<DocumentType, string>> = {
	[DocumentType.Sales]: "sales",
	[DocumentType.SalesReturn]: "sales",
	[DocumentType.SalesDebitNote]: "sales",
	[DocumentType.Purchase]: "purchases",
	[DocumentType.PurchaseReturn]: "purchases",
	[DocumentType.PurchaseDebitNote]: "purchases",
	[DocumentType.Payment]: "vouchers",
	[DocumentType.Receipt]: "vouchers",
	[DocumentType.VoucherDistribution]: "vouchers",
	[DocumentType.BalanceTransfer]: "balanceTransfer",
	[DocumentType.CostAdjustment]: "costAdjustments",
	[DocumentType.OpeningBalance]: "accounts",
	[DocumentType.OpeningQuantity]: "itemsSettlements",
	[DocumentType.ItemsSettlement]: "itemsSettlements",
	[DocumentType.ItemTransfer]: "itemTransfers",
	[DocumentType.YearEndClosing]: "fiscalYears",
	[DocumentType.PosSessionVariance]: "posSessions",
	[DocumentType.ManualAdjustment]: "manualAdjustments"
};

export function getDocumentTypeName(type?: DocumentType): string
{
	if (type === undefined) return DOCUMENT_TYPE_NAMES[DocumentType.None];
	return DOCUMENT_TYPE_NAMES[type] ?? DOCUMENT_TYPE_NAMES[DocumentType.None];
}

export function getDocumentRoute(type?: DocumentType): string | undefined
{
	if (type === undefined) return undefined;
	return DOCUMENT_ROUTES[type];
}