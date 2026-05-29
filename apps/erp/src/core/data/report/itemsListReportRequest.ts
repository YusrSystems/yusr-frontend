import type { BaseReportRequest } from "./baseReportRequest";

export class ItemsListReportRequest implements BaseReportRequest
{
  searchText?: string;

  constructor(init?: Partial<ItemsListReportRequest>)
  {
    Object.assign(this, init);
  }
}
