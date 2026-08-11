export enum DocumentType
{
	None,
	Sales,
	SalesReturn,
	Purchase,
	PurchaseReturn,
	Payment,
	Receipt,
	BalanceTransfer,
	CostAdjustment,
	OpeningBalance,
	ManualAdjustment,
	OpeningQuantity,
	ItemTransfer,
	ItemsSettlement,
}

const DOCUMENT_TYPE_NAMES: Record<DocumentType, string> = {
	[DocumentType.None]: "غير معروف",
	[DocumentType.Sales]: "فاتورة مبيعات",
	[DocumentType.SalesReturn]: "مرتجع مبيعات",
	[DocumentType.Purchase]: "فاتورة مشتريات",
	[DocumentType.PurchaseReturn]: "مرتجع مشتريات",
	[DocumentType.Payment]: "سند صرف",
	[DocumentType.Receipt]: "سند قبض",
	[DocumentType.BalanceTransfer]: "نقل رصيد",
	[DocumentType.CostAdjustment]: "تسوية تكلفة",
	[DocumentType.OpeningBalance]: "رصيد افتتاحي",
	[DocumentType.OpeningQuantity]: "كمية افتتاحية",
	[DocumentType.ManualAdjustment]: "تسوية يدوية",
	[DocumentType.ItemTransfer]: "نقل مواد",
	[DocumentType.ItemsSettlement]: "تسوية مواد"
};

const DOCUMENT_ROUTES: Partial<Record<DocumentType, string>> = {
	[DocumentType.Sales]: "sales",
	[DocumentType.SalesReturn]: "sales",
	[DocumentType.Purchase]: "purchases",
	[DocumentType.PurchaseReturn]: "purchases",
	[DocumentType.Payment]: "vouchers",
	[DocumentType.Receipt]: "vouchers",
	[DocumentType.BalanceTransfer]: "balanceTransfer",
	[DocumentType.CostAdjustment]: "costAdjustments",
	[DocumentType.OpeningBalance]: "openingBalances",
	[DocumentType.OpeningQuantity]: "openingQuantities",
	[DocumentType.ManualAdjustment]: "manualAdjustments",
	[DocumentType.ItemTransfer]: "itemTransfers",
	[DocumentType.ItemsSettlement]: "itemsSettlements"
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