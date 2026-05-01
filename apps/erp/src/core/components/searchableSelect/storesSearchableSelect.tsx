import StoresApiService from "@/core/networking/storeApiService";
import ChangeStoreDialog from "@/features/stores/changeStoreDialog";
import type { EntitySearchableSelectParams } from "yusr-ui";
import ChangableSearchableSelect from "../../../../../../packages/yusr-ui/src/components/custom/select/changableSearchableSelect";
import { SystemPermissionsResources } from "../../auth/systemPermissionsResources";
import type Store from "../../data/store";
import { StoreFilterColumns, StoreSlice } from "../../data/store";
import { useAppSelector } from "../../state/store";

export default function StoresSearchableSelect(
  { id, disabled, isInvalid, onValueChange }: EntitySearchableSelectParams<Store>
)
{
  const storeState = useAppSelector((state) => state.store);

  return (
    <ChangableSearchableSelect<Store>
      mode="inline"
      id={ id }
      itemLabelKey="name"
      itemValueKey="id"
      state={ storeState }
      apiService={ new StoresApiService() }
      columnsNames={ StoreFilterColumns.columnsNames }
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
      createEntity={ (typedValue) =>
      {
        return { name: typedValue } as Store;
      } }
      changeDialog={ ChangeStoreDialog }
    />
  );
}
