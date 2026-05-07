import type { FilterCondition } from "yusr-ui";
import type { AccountType } from "../account";
import type Account from "../account";
import type { BaseReportRequest } from "./baseReportRequest";

export class AccountsListReportRequest implements BaseReportRequest
{
  type!: AccountType;
  condition?: FilterCondition<Account>;

  constructor(init?: Partial<AccountsListReportRequest>)
  {
    Object.assign(this, init);
  }
}
