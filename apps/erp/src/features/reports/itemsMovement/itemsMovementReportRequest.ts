import { DocumentType } from "@/core/types/documentType.ts";


export class ItemsMovementReportRequest
{
	documentTypes?: DocumentType[] | null;
	itemIds?: number[] | null;
	categoryIds?: number[] | null;
	brandIds?: number[] | null;
	fromDate?: string | null;
	toDate?: string | null;
	storeId?: number | null;
	storeName?: string | null;
	partnerId?: number | null;
	partnerName?: string | null;
	pageNumber?: number;
	rowsPerPage?: number;

	constructor(init?: Partial<ItemsMovementReportRequest>)
	{
		Object.assign(this, init);
	}
}