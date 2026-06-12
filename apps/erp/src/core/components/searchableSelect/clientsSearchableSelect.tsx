import Account, { AccountType, ClientsSlice } from "@/core/data/accountOld";
import type { BasicSearchableSelectParamsOld } from "yusr-ui";
import AccountsSearchableSelectOld from "./accountsSearchableSelect";

export default function ClientsSearchableSelect(
  { ...props }: BasicSearchableSelectParamsOld<Account>
)
{
  return (
    <AccountsSearchableSelectOld
      slice={ ClientsSlice }
      selectEntityState={ (state) => state.clients }
      selectFormState={ (state) => state.clientsForm }
      fixedType={ AccountType.Client }
      { ...props }
    />
  );
}
