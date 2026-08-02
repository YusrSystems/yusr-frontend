import { DocumentType } from "@/core/types/documentType.ts";


export interface ItemsMovementLine
{
	id: number;
	date: string;
	documentType: DocumentType;
	documentId: number;
	itemId: number;
	itemName: string;
	storeName: string;
	partnerName?: string;
	quantityIn: number;
	quantityOut: number;
	unitCost: number;
	value: number;
}

export interface ItemsMovementReportResult
{
	lines: ItemsMovementLine[];
	fromDate?: string;
	toDate?: string;
	storeId?: number;
	storeName?: string;
	partnerId?: number;
	partnerName?: string;
	totalQuantityIn: number;
	totalQuantityOut: number;
	totalValue: number;

	pageNumber: number;
	rowsPerPage: number;
	totalCount: number;
}