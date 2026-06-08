import { StoreSlice } from "@/core/data/storeSlice";
import StoresApiServiceOld from "@/core/networking/storesApiServiceOld";
import ChangeStoreDialog from "@/features/stores/changeStoreDialog";
import { type BasicSearchableSelectParamsOld, ChangableSearchableSelect } from "yusr-ui";
import { SystemPermissionsResources } from "../../auth/systemPermissionsResources";
import type StoreOld from "../../data/store";
import { useAppSelector } from "../../state/store";

export default function StoresSearchableSelect(
  { ...props }: BasicSearchableSelectParamsOld<StoreOld> & { items?: StoreOld[]; }
)
{
  const storeState = useAppSelector((state) => state.store);
  const authState = useAppSelector((state) => state.auth);

  return (
    <ChangableSearchableSelect<StoreOld>
      labelKey="name"
      createKey="name"
      mode="inline"
      state={ storeState }
      apiService={ new StoresApiServiceOld() }
      systemPermissionsResources={ SystemPermissionsResources.Stores }
      allowAdd={ false }
      allowUpdate={ false }
      entityActions={ {
        filter: StoreSlice.entityActions.filter,
        refresh: StoreSlice.entityActions.refresh
      } }
      changeDialog={ ChangeStoreDialog }
      authPermissions={ authState.loggedInUser?.role?.permissions ?? [] }
      { ...props }
    />
  );
}
