import Account, { AccountType, ClientsSlice } from "@/core/data/account";
import type { EntitySearchableSelectParams } from "yusr-ui";
import AccountsSearchableSelect from "./accountsSearchableSelect";

export default function ClientsSearchableSelect(
  { id, isInvalid, onValueChange }: EntitySearchableSelectParams<Account>
)
{
  return (
    <AccountsSearchableSelect
      id={ id }
      isInvalid={ isInvalid }
      onValueChange={ onValueChange }
      slice={ ClientsSlice }
      selectEntityState={ (state) => state.clients }
      selectFormState={ (state) => state.clientsForm }
      fixedType={ AccountType.Client }
    />
  );
}
