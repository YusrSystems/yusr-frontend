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
	ItemsSettlement
}

export function getDocumentTypeName(type?: DocumentType): string
{
	switch (type)
	{
		case DocumentType.Sales:
			return "فاتورة مبيعات";
		case DocumentType.SalesReturn:
			return "مرتجع مبيعات";
		case DocumentType.Purchase:
			return "فاتورة مشتريات";
		case DocumentType.PurchaseReturn:
			return "مرتجع مشتريات";
		case DocumentType.Payment:
			return "سند صرف";
		case DocumentType.Receipt:
			return "سند قبض";
		case DocumentType.BalanceTransfer:
			return "نقل رصيد";
		case DocumentType.CostAdjustment:
			return "تسوية تكلفة";
		case DocumentType.OpeningBalance:
			return "رصيد افتتاحي";
		case DocumentType.OpeningQuantity:
			return "كمية افتتاحية";
		case DocumentType.ManualAdjustment:
			return "تسوية يدوية";
		case DocumentType.None:
		default:
			return "غير معروف";
	}
}

export function getDocumentRoute(type?: DocumentType): string | undefined
{
	switch (type)
	{
		case DocumentType.Sales:
		case DocumentType.SalesReturn:
			return "sales";
		case DocumentType.Purchase:
		case DocumentType.PurchaseReturn:
			return "purchases";
		case DocumentType.Payment:
		case DocumentType.Receipt:
			return "vouchers";
		case DocumentType.BalanceTransfer:
			return "balanceTransfer";
		case DocumentType.CostAdjustment:
			return "costAdjustments";
		default:
			return undefined;
	}
}