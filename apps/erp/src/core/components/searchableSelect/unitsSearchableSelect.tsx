import UnitsApiService from "@/core/networking/unitApiService";
import ChangeUnitDialog from "@/features/units/changeUnitDialog";
import type { EntitySearchableSelectParams } from "yusr-ui";
import ChangableSearchableSelect from "../../../../../../packages/yusr-ui/src/components/custom/select/changableSearchableSelect";
import { SystemPermissionsResources } from "../../auth/systemPermissionsResources";
import type Unit from "../../data/unit";
import { UnitFilterColumns, UnitSlice } from "../../data/unit";
import { useAppSelector } from "../../state/store";

export default function UnitsSearchableSelect(
  { id, disabled, isInvalid, onValueChange }: EntitySearchableSelectParams<Unit>
)
{
  const unitState = useAppSelector((state) => state.unit);

  return (
    <ChangableSearchableSelect<Unit>
      mode="inline"
      id={ id }
      itemLabelKey="name"
      itemValueKey="id"
      state={ unitState }
      apiService={ new UnitsApiService() }
      columnsNames={ UnitFilterColumns.columnsNames }
      disabled={ disabled }
      isInvalid={ isInvalid }
      systemPermissionsResources={ SystemPermissionsResources.Units }
      allowAdd={ false }
      allowUpdate={ false }
      onValueChange={ onValueChange }
      entityActions={ {
        filter: UnitSlice.entityActions.filter,
        refresh: UnitSlice.entityActions.refresh
      } }
      changeDialog={ ChangeUnitDialog }
    />
  );
}
