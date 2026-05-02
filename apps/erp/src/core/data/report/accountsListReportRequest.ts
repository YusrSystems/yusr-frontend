import type { FilterCondition } from "yusr-core";
import type { AccountType } from "../account";
import type { BaseReportRequest } from "./baseReportRequest";
import type Account from "../account";

export class AccountsListReportRequest implements BaseReportRequest
{
  type!: AccountType;
  condition?: FilterCondition<Account>;

  constructor(init?: Partial<AccountsListReportRequest>)
  {
    Object.assign(this, init);
  }
}
