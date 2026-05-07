import StoresApiService from "@/core/networking/storeApiService";
import ChangeStoreDialog from "@/features/stores/changeStoreDialog";
import { useTranslation } from "react-i18next";
import { ChangableSearchableSelect, type EntitySearchableSelectParams } from "yusr-ui";
import { SystemPermissionsResources } from "../../auth/systemPermissionsResources";
import type Store from "../../data/store";
import { StoreFilterColumns, StoreSlice } from "../../data/store";
import { useAppSelector } from "../../state/store";

export default function StoresSearchableSelect(
  { id, items, disabled, isInvalid, onValueChange }: EntitySearchableSelectParams<Store> & { items?: Store[]; }
)
{
  const storeState = useAppSelector((state) => state.store);
  const authState = useAppSelector((state) => state.auth);
  const { t } = useTranslation("stocking");

  return (
    <ChangableSearchableSelect<Store>
      mode="inline"
      id={ id }
      items={ items }
      itemLabelKey="name"
      itemValueKey="id"
      state={ storeState }
      apiService={ new StoresApiService() }
      columnsNames={ StoreFilterColumns.columnsNames(t) }
      disabled={ disabled }
      isInvalid={ isInvalid }
      systemPermissionsResources={ SystemPermissionsResources.Stores }
      allowAdd={ false }
      allowUpdate={ false }
      onValueChange={ onValueChange }
      entityActions={ {
        filter: StoreSlice.entityActions.filter,
        refresh: StoreSlice.entityActions.refresh
      } }
      changeDialog={ ChangeStoreDialog }
      authPermissions={ authState.loggedInUser?.role?.permissions ?? [] }
    />
  );
}
