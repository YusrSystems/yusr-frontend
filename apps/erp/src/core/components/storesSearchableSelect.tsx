import { ResultStatus, SystemPermissions } from "yusr-core";
import { SearchableSelect } from "yusr-ui";
import { SystemPermissionsActions } from "../auth/systemPermissionsActions";
import { SystemPermissionsResources } from "../auth/systemPermissionsResources";
import Store, { StoreFilterColumns, StoreSlice } from "../data/store";
import StoresApiService from "../networking/storeApiService";
import { useAppDispatch, useAppSelector } from "../state/store";

export type StoresSearchableSelectParams = {
  storeId?: number;
  disabled?: boolean;
  isInvalid?: boolean;
  onValueChange: (value: Store) => void;
};

export default function StoresSearchableSelect(
  { storeId, disabled, isInvalid, onValueChange }: StoresSearchableSelectParams
)
{
  const storeState = useAppSelector((state) => state.store);
  const authState = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  return (
    <SearchableSelect
      items={ storeState.entities.data ?? [] }
      itemLabelKey="name"
      itemValueKey="id"
      value={ storeId?.toString() || "" }
      onValueChange={ (val) =>
      {
        const selected = storeState.entities.data?.find(
          (s) => s.id.toString() === val
        );

        if (selected)
        {
          onValueChange(selected);
        }
      } }
      columnsNames={ StoreFilterColumns.columnsNames }
      onSearch={ (condition) => dispatch(StoreSlice.entityActions.filter(condition)) }
      isLoading={ storeState.isLoading }
      disabled={ storeState.isLoading || disabled }
      isInvalid={ isInvalid }
      onNotFound={ SystemPermissions.hasAuth(
          authState.loggedInUser?.role?.permissions ?? [],
          SystemPermissionsResources.Stores,
          SystemPermissionsActions.Add
        )
        ? async (typedValue) =>
        {
          var res = await new StoresApiService().Add({ name: typedValue, id: 0, createdBy: 0, authorized: true });
          if (res.status === ResultStatus.Ok)
          {
            if (res.data)
            {
              onValueChange(res.data);
              dispatch(StoreSlice.entityActions.refresh({ data: res.data }));
              dispatch(StoreSlice.entityActions.filter());
            }
          }
        }
        : undefined }
      onDelete={ SystemPermissions.hasAuth(
          authState.loggedInUser?.role?.permissions ?? [],
          SystemPermissionsResources.Stores,
          SystemPermissionsActions.Delete
        )
        ? async (id) =>
        {
          const res = await new StoresApiService().Delete(id);
          if (res.status === ResultStatus.Ok)
          {
            dispatch(StoreSlice.entityActions.refresh({ deletedId: id }));
            return true;
          }
          return false;
        }
        : undefined }
    />
  );
}
