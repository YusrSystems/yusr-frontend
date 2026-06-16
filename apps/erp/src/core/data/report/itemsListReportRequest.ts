import type { BaseReportRequest } from "./baseReportRequest";
import type { ItemType } from "@/core/data/item.ts";


export class ItemsListReportRequest implements BaseReportRequest
{
	searchText?: string;
	itemType?: ItemType;
	class?: string;
	brand?: string;
	storeId?: number;
	storeName?: string;

	constructor(init?: Partial<ItemsListReportRequest>)
	{
		Object.assign(this, init);
	}
}
