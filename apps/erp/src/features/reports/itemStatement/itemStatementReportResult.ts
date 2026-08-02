import type { DocumentType } from "@/core/types/documentType.ts";


export interface ItemStatementLine
{
	id: number;
	date: string;
	documentType: DocumentType;
	documentId: number;
	storeName: string;
	secondPartyName: string;
	quantityIn: number;
	quantityOut: number;
	runningQuantity: number;
	unitCost: number;
}

export interface ItemStatementReportResult
{
	lines: ItemStatementLine[];
	itemId: number;
	itemName: string;
	storeId: number;
	storeName: string;
	cost: number;
	quantity: number;
	minQuantity?: number;
	maxQuantity?: number;
	notes?: string;

	// Historical Prices Cache
	lastBuyPrice: number;
	lastSellPrice: number;
	minBuyPrice: number;
	maxBuyPrice: number;
	minSellPrice: number;
	maxSellPrice: number;

	totalCount: number;
	pageNumber: number;
	rowsPerPage: number;

	// Page-level total summaries
	pageTotalQuantityIn: number;
	pageTotalQuantityOut: number;
}