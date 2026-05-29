import ChangeTaxDialog from "@/features/taxes/changeTaxDialog";
import { type BasicSearchableSelectParams, ChangableSearchableSelect } from "yusr-ui";
import { SystemPermissionsResources } from "../../auth/systemPermissionsResources";
import { Tax, TaxSlice } from "../../data/tax";
import TaxesApiService from "../../networking/taxesApiService";
import { useAppSelector } from "../../state/store";

export default function TaxesSearchableSelect(
  { ...props }: BasicSearchableSelectParams<Tax>
)
{
  const taxState = useAppSelector((state) => state.tax);
  const authState = useAppSelector((state) => state.auth);

  return (
    <ChangableSearchableSelect<Tax>
      labelKey="name"
      createKey="name"
      state={ taxState }
      apiService={ new TaxesApiService() }
      systemPermissionsResources={ SystemPermissionsResources.Taxes }
      entityActions={ {
        filter: TaxSlice.entityActions.filter,
        refresh: TaxSlice.entityActions.refresh
      } }
      changeDialog={ ChangeTaxDialog }
      authPermissions={ authState.loggedInUser?.role?.permissions ?? [] }
      { ...props }
    />
  );
}
