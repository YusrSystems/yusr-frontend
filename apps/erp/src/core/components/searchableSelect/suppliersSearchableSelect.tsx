import Account, { AccountType, SuppliersSlice } from "@/core/data/account";
import type { EntitySearchableSelectParams } from "yusr-ui";
import AccountsSearchableSelect from "./accountsSearchableSelect";

export default function SuppliersSearchableSelect(
  { id, isInvalid, onValueChange }: EntitySearchableSelectParams<Account>
)
{
  return (
    <AccountsSearchableSelect
      id={ id }
      isInvalid={ isInvalid }
      onValueChange={ onValueChange }
      slice={ SuppliersSlice }
      selectEntityState={ (state) => state.suppliers }
      selectFormState={ (state) => state.suppliersForm }
      fixedType={ AccountType.Supplier }
    />
  );
}
