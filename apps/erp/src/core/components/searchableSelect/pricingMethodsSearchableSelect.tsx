import PricingMethodsApiService from "@/core/networking/PricingMethodsApiService";
import ChangePricingMethodDialog from "@/features/pricingMethods/changePricingMethodDialog";
import type { EntitySearchableSelectParams } from "yusr-ui";
import ChangableSearchableSelect from "../../../../../../packages/yusr-ui/src/components/custom/select/changableSearchableSelect";
import { SystemPermissionsResources } from "../../auth/systemPermissionsResources";
import type PricingMethod from "../../data/pricingMethod";
import { PricingMethodFilterColumns, PricingMethodSlice } from "../../data/pricingMethod";
import { useAppSelector } from "../../state/store";

export default function PricingMethodsSearchableSelect(
  { id, disabled, isInvalid, onValueChange }: EntitySearchableSelectParams<PricingMethod>
)
{
  const pricingMethodState = useAppSelector((state) => state.pricingMethod);

  return (
    <ChangableSearchableSelect<PricingMethod>
      mode="inline"
      id={ id }
      itemLabelKey="name"
      itemValueKey="id"
      state={ pricingMethodState }
      apiService={ new PricingMethodsApiService() }
      columnsNames={ PricingMethodFilterColumns.columnsNames }
      disabled={ disabled }
      isInvalid={ isInvalid }
      systemPermissionsResources={ SystemPermissionsResources.PricingMethods }
      allowAdd={ false }
      allowUpdate={ false }
      onValueChange={ onValueChange }
      entityActions={ {
        filter: PricingMethodSlice.entityActions.filter,
        refresh: PricingMethodSlice.entityActions.refresh
      } }
      createEntity={ (con) =>
      {
        return { name: con.value } as PricingMethod;
      } }
      changeDialog={ ChangePricingMethodDialog }
    />
  );
}
