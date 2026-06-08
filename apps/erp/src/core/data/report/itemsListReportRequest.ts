import type { ItemType } from "../item";
import type { BaseReportRequest } from "./baseReportRequest";

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
