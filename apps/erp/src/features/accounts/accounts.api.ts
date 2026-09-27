import { createCrudResource } from "yusr-ui";
import { type AccountDto } from "@/core/data/account";

export const accountsApi = createCrudResource<AccountDto>("Accounts");