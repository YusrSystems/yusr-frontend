import StoresApiService from "@/core/networking/storeApiService";
import ChangeStoreDialog from "@/features/stores/changeStoreDialog";
import { type BasicSearchableSelectParams, ChangableSearchableSelect } from "yusr-ui";
import { SystemPermissionsResources } from "../../auth/systemPermissionsResources";
import type Store from "../../data/store";
import { StoreSlice } from "../../data/store";
import { useAppSelector } from "../../state/store";

export default function StoresSearchableSelect(
  { ...props }: BasicSearchableSelectParams<Store> & { items?: Store[]; }
)
{
  const storeState = useAppSelector((state) => state.store);
  const authState = useAppSelector((state) => state.auth);

  return (
    <ChangableSearchableSelect<Store>
      labelKey="name"
      createKey="name"
      mode="inline"
      state={ storeState }
      apiService={ new StoresApiService() }
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
