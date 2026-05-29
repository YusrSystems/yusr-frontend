import type { BaseReportRequest } from "./baseReportRequest";

export class VouchersListReportRequest implements BaseReportRequest
{
  searchText?: string;

  constructor(init?: Partial<VouchersListReportRequest>)
  {
    Object.assign(this, init);
  }
}
