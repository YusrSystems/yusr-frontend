import { type AccountDto } from "@/core/data/account";
import { createCrudResource } from "#/api";


export const accountsApi = createCrudResource<AccountDto>("Accounts");