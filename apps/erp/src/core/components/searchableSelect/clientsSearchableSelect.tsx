import Account, { AccountType, ClientsSlice } from "@/core/data/account";
import type { BasicSearchableSelectParams } from "yusr-ui";
import AccountsSearchableSelect from "./accountsSearchableSelect";

export default function ClientsSearchableSelect(
  { ...props }: BasicSearchableSelectParams<Account>
)
{
  return (
    <AccountsSearchableSelect
      slice={ ClientsSlice }
      selectEntityState={ (state) => state.clients }
      selectFormState={ (state) => state.clientsForm }
      fixedType={ AccountType.Client }
      { ...props }
    />
  );
}
