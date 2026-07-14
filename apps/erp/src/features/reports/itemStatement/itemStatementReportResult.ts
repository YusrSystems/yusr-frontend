import { AccountType } from "@/core/data/account.ts";
import type { InvoiceType } from "@/core/types/invoiceType.ts";
import type { StoreDto } from "@/core/data/store.ts";


export enum AccountOrStoreType
{
	Store = 0,
	Account = 1
}

export enum ItemStatementDocumentType
{
	Opening = 0,
	Invoice = 1,
	Transfer = 2,
	Settlement = 3
}

export interface ItemStatementRow
{
	transDate: string;
	transType: string;
	transId: number;
	transQtn: number;
	mainUnitQtn: number;
	cost: number;
	itemQtn: number;

	documentType: ItemStatementDocumentType;
	invoiceType?: InvoiceType;

	storeId?: number;
	storeName?: string;

	secondPartyId?: number;
	secondPartyName?: string;
	secondPartyType: AccountOrStoreType;
	secondPartyAccountType?: AccountType;
}

export interface ItemStatementReportResult
{
	itemStatementRows: ItemStatementRow[];
	store?: StoreDto;
	itemId: number;
	itemName: string;
	cost: number;
	quantity: number;
	minQuantity?: number;
	maxQuantity?: number;
	notes?: string;
	lastBuyPrice: number;
	lastSellPrice: number;
	minBuyPrice: number;
	maxBuyPrice: number;
	minSellPrice: number;
	maxSellPrice: number;

	pageNumber: number;
	rowsPerPage: number;
	totalCount: number;
}