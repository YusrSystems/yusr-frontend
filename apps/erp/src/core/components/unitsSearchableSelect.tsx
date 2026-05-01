import { ResultStatus } from "yusr-core";
import { SearchableSelect } from "yusr-ui";
import { ItemSlice } from "../data/item";
import Unit, { UnitFilterColumns, UnitSlice } from "../data/unit";
import UnitsApiService from "../networking/unitApiService";
import { useAppDispatch, useAppSelector } from "../state/store";

export type UnitsSearchableSelectParams = {
  unitId?: number;
  disabled: boolean;
  onValueChange: (value: Unit) => void;
};

export default function UnitsSearchableSelect({ unitId, disabled, onValueChange }: UnitsSearchableSelectParams)
{
  const unitState = useAppSelector((state) => state.unit);
  const dispatch = useAppDispatch();

  return (
    <SearchableSelect
      items={ unitState.entities.data ?? [] }
      itemLabelKey="name"
      itemValueKey="id"
      value={ unitId?.toString() || "" }
      onValueChange={ (val) =>
      {
        const selected = unitState.entities.data?.find(
          (u) => u.id.toString() === val
        );

        if (selected)
        {
          onValueChange(selected);
        }
      } }
      columnsNames={ UnitFilterColumns.columnsNames }
      onSearch={ (condition) => dispatch(UnitSlice.entityActions.filter(condition)) }
      isLoading={ unitState.isLoading }
      disabled={ unitState.isLoading || disabled }
      onNotFound={ async (typedValue) =>
      {
        var res = await new UnitsApiService().Add({ name: typedValue, id: 0 });
        if (res.status === ResultStatus.Ok)
        {
          dispatch(ItemSlice.formActions.updateFormData({
            sellUnitId: res.data?.id,
            sellUnitName: res.data?.name
          }));
          dispatch(UnitSlice.entityActions.refresh({ data: res.data }));
          dispatch(UnitSlice.entityActions.filter());
        }
      } }
      onDelete={ async (id) =>
      {
        const res = await new UnitsApiService().Delete(id);
        if (res.status === ResultStatus.Ok)
        {
          dispatch(UnitSlice.entityActions.refresh({ deletedId: id }));
          return true;
        }
        return false;
      } }
    />
  );
}
