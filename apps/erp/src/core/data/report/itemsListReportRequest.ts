import type { FilterCondition } from "yusr-ui";
import type Item from "../item";
import type { BaseReportRequest } from "./baseReportRequest";

export class ItemsListReportRequest implements BaseReportRequest
{
  condition?: FilterCondition<Item>;

  constructor(init?: Partial<ItemsListReportRequest>)
  {
    Object.assign(this, init);
  }
}
