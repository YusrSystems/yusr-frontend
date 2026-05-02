import ChangeTaxDialog from "@/features/taxes/changeTaxDialog";
import type { EntitySearchableSelectParams } from "yusr-ui";
import ChangableSearchableSelect from "../../../../../../packages/yusr-ui/src/components/custom/select/changableSearchableSelect";
import { SystemPermissionsResources } from "../../auth/systemPermissionsResources";
import { Tax, TaxFilterColumns, TaxSlice } from "../../data/tax";
import TaxesApiService from "../../networking/taxesApiService";
import { useAppSelector } from "../../state/store";

export default function TaxesSearchableSelect(
  { id, disabled, isInvalid, onValueChange }: EntitySearchableSelectParams<Tax>
)
{
  const taxState = useAppSelector((state) => state.tax);

  return (
    <ChangableSearchableSelect<Tax>
      id={ id }
      itemLabelKey="name"
      itemValueKey="id"
      state={ taxState }
      apiService={ new TaxesApiService() }
      columnsNames={ TaxFilterColumns.columnsNames }
      disabled={ disabled }
      isInvalid={ isInvalid }
      systemPermissionsResources={ SystemPermissionsResources.Taxes }
      onValueChange={ onValueChange }
      entityActions={ {
        filter: TaxSlice.entityActions.filter,
        refresh: TaxSlice.entityActions.refresh
      } }
      changeDialog={ ChangeTaxDialog }
    />
  );
}
