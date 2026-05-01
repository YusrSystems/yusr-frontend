import { ResultStatus, SystemPermissions } from "yusr-core";
import { SearchableSelect } from "yusr-ui";
import { SystemPermissionsActions } from "../auth/systemPermissionsActions";
import { SystemPermissionsResources } from "../auth/systemPermissionsResources";
import type PricingMethod from "../data/pricingMethod";
import { PricingMethodFilterColumns, PricingMethodSlice } from "../data/pricingMethod";
import PricingMethodsApiService from "../networking/PricingMethodsApiService";
import { useAppDispatch, useAppSelector } from "../state/store";

export type PricingMethodsSearchableSelectParams = {
  pricingMethodId?: number;
  disabled: boolean;
  isInvalid?: boolean;
  onValueChange: (value: PricingMethod) => void;
};

export default function PricingMethodsSearchableSelect(
  { pricingMethodId, disabled, isInvalid, onValueChange }: PricingMethodsSearchableSelectParams
)
{
  const pricingMethodState = useAppSelector((state) => state.pricingMethod);
  const authState = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  return (
    <SearchableSelect
      items={ pricingMethodState.entities.data ?? [] }
      itemLabelKey="name"
      itemValueKey="id"
      value={ pricingMethodId?.toString() || "" }
      onValueChange={ (val) =>
      {
        const selected = pricingMethodState.entities.data?.find(
          (p) => p.id.toString() === val
        );

        if (selected)
        {
          onValueChange(selected);
        }
      } }
      columnsNames={ PricingMethodFilterColumns.columnsNames }
      onSearch={ (condition) => dispatch(PricingMethodSlice.entityActions.filter(condition)) }
      isLoading={ pricingMethodState.isLoading }
      disabled={ pricingMethodState.isLoading || disabled }
      isInvalid={ isInvalid }
      onNotFound={ SystemPermissions.hasAuth(
          authState.loggedInUser?.role?.permissions ?? [],
          SystemPermissionsResources.PricingMethods,
          SystemPermissionsActions.Add
        )
        ? async (typedValue) =>
        {
          var res = await new PricingMethodsApiService().Add({ name: typedValue, id: 0 });
          if (res.status === ResultStatus.Ok)
          {
            if (res.data)
            {
              onValueChange(res.data);
              dispatch(PricingMethodSlice.entityActions.refresh({ data: res.data }));
              dispatch(PricingMethodSlice.entityActions.filter());
            }
          }
        }
        : undefined }
      onDelete={ SystemPermissions.hasAuth(
          authState.loggedInUser?.role?.permissions ?? [],
          SystemPermissionsResources.PricingMethods,
          SystemPermissionsActions.Delete
        )
        ? async (id) =>
        {
          const res = await new PricingMethodsApiService().Delete(id);
          if (res.status === ResultStatus.Ok)
          {
            dispatch(PricingMethodSlice.entityActions.refresh({ deletedId: id }));
            return true;
          }
          return false;
        }
        : undefined }
    />
  );
}
