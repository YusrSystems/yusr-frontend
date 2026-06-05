import Account, { AccountType, SuppliersSlice } from "@/core/data/account";
import type { BasicSearchableSelectParamsOld } from "yusr-ui";
import AccountsSearchableSelect from "./accountsSearchableSelect";

export default function SuppliersSearchableSelect(
  { ...props }: BasicSearchableSelectParamsOld<Account>
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
