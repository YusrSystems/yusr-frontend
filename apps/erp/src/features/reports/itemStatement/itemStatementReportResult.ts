import type { DocumentType } from "@/core/types/documentType.ts";


export interface ItemStatementLine
{
	id: number;
	date: string;
	documentType: DocumentType;
	documentId: number;
	partnerName: string;
	quantityIn: number;
	quantityOut: number;
	transactionCost: number;
	runningQuantity: number;
	runningAverageCost: number;
	runningValuationValue: number;
}

export interface ItemStatementReportResult
{
	itemId: number;
	itemName: string;
	minQuantity?: number;
	maxQuantity?: number;
	notes?: string;
	storeId?: number;
	storeName?: string;
	fromDate: string;
	toDate: string;

	openingQuantity: number;
	openingAverageCost: number;
	openingValuation: number;

	closingQuantity: number;
	closingAverageCost: number;
	closingValuation: number;

	// Historical Prices Cache
	lastBuyPrice: number;
	lastSellPrice: number;
	minBuyPrice: number;
	maxBuyPrice: number;
	minSellPrice: number;
	maxSellPrice: number;

	lines: ItemStatementLine[];
	totalCount: number;
	pageNumber: number;
	rowsPerPage: number;
}