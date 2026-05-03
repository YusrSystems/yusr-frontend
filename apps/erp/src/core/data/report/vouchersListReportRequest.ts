import type { FilterCondition } from "yusr-ui";
import type Voucher from "../voucher";
import type { BaseReportRequest } from "./baseReportRequest";

export class VouchersListReportRequest implements BaseReportRequest
{
  condition?: FilterCondition<Voucher>;

  constructor(init?: Partial<VouchersListReportRequest>)
  {
    Object.assign(this, init);
  }
}
