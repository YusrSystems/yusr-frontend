import AccountOld, { AccountType, SuppliersSlice } from "@/core/data/account";
import type { BasicSearchableSelectParamsOld } from "yusr-ui";
import AccountsSearchableSelectOld from "./accountsSearchableSelect";

export default function SuppliersSearchableSelectOld(
  { ...props }: BasicSearchableSelectParamsOld<AccountOld>
)
{
  return (
    <AccountsSearchableSelectOld
      slice={ SuppliersSlice }
      selectEntityState={ (state) => state.suppliers }
      selectFormState={ (state) => state.suppliersForm }
      fixedType={ AccountType.Supplier }
      { ...props }
    />
  );
}

// export function SuppliersSearchableSelect(
//   { ...props }: BasicSearchableSelectParamsOld<Account>
// )
// {
//   return (
//     <AccountsSearchableSelect
//     id={}

//       { ...props }
//     />
//   );
// }
