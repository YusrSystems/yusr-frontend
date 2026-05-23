import Account, { AccountType, SuppliersSlice } from "@/core/data/account";
import type { BasicSearchableSelectParams } from "yusr-ui";
import AccountsSearchableSelect from "./accountsSearchableSelect";

export default function SuppliersSearchableSelect(
  { ...props }: BasicSearchableSelectParams<Account>
)
{
  return (
    <AccountsSearchableSelect
      slice={ SuppliersSlice }
      selectEntityState={ (state) => state.suppliers }
      selectFormState={ (state) => state.suppliersForm }
      fixedType={ AccountType.Supplier }
      { ...props }
    />
  );
}
