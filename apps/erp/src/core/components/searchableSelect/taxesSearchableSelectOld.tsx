import ChangeTaxDialogOld from "@/features/taxes/changeTaxDialogOld";
import { type BasicSearchableSelectParamsOld, ChangableSearchableSelect } from "yusr-ui";
import { SystemPermissionsResources } from "../../auth/systemPermissionsResources";
import { TaxOld, TaxSlice } from "../../data/tax";
import TaxesApiServiceOld from "../../networking/taxesApiServiceold";
import { useAppSelector } from "../../state/store";

export default function TaxesSearchableSelectOld(
  { ...props }: BasicSearchableSelectParamsOld<TaxOld>
)
{
  const taxState = useAppSelector((state) => state.tax);
  const authState = useAppSelector((state) => state.auth);

  return (
    <ChangableSearchableSelect<TaxOld>
      labelKey="name"
      createKey="name"
      state={ taxState }
      apiService={ new TaxesApiServiceOld() }
      systemPermissionsResources={ SystemPermissionsResources.Taxes }
      entityActions={ {
        filter: TaxSlice.entityActions.filter,
        refresh: TaxSlice.entityActions.refresh
      } }
      changeDialog={ ChangeTaxDialogOld }
      authPermissions={ authState.loggedInUser?.role?.permissions ?? [] }
      { ...props }
    />
  );
}
