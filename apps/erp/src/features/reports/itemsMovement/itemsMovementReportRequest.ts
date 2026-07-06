export const ItemsMovementReportTransType = {
	Sell: 1,
	Purchase: 2,
	SellReturn: 3,
	PurchaseReturn: 5,
	Transfer: 6,
	Settlement: 7
} as const;

export type ItemsMovementReportTransType =
	typeof ItemsMovementReportTransType[keyof typeof ItemsMovementReportTransType];

export const ItemsMovementReportGroupOption = {
	Item: 1,
	From: 2,
	To: 3,
	Day: 5,
	Month: 6,
	Year: 7
} as const;

export type ItemsMovementReportGroupOption =
	typeof ItemsMovementReportGroupOption[keyof typeof ItemsMovementReportGroupOption];

export class ItemsMovementReportRequest
{
	transTypeIds?: number[] | null;
	itemIds?: number[] | null;
	itemClasses?: string[] | null;
	itemBrands?: string[] | null;
	fromDate?: string | null;
	toDate?: string | null;
	fromAccountId?: number | null;
	toAccountId?: number | null;
	fromStoreId?: number | null;
	toStoreId?: number | null;
	groupOption?: number | null;
	pageNumber?: number;
	rowsPerPage?: number;

	constructor(init?: Partial<ItemsMovementReportRequest>)
	{
		Object.assign(this, init);
	}
}