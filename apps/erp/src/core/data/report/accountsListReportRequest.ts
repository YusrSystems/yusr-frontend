import type { AccountType } from "../account";
import type { BaseReportRequest } from "./baseReportRequest";

export class AccountsListReportRequest implements BaseReportRequest
{
  type!: AccountType;
  searchText?: string;

  constructor(init?: Partial<AccountsListReportRequest>)
  {
    Object.assign(this, init);
  }
}
