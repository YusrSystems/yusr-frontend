import type { BaseReportRequest } from "./baseReportRequest";

export class TaxReturnReportRequest implements BaseReportRequest
{
  fromDate!: string;
  toDate!: string;

  constructor(init?: Partial<TaxReturnReportRequest>)
  {
    Object.assign(this, init);
  }
}
