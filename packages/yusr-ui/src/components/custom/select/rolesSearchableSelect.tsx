import { Role, RoleFilterColumns, RoleSlice } from "../../../entities";
import { useAppDispatch, type YusrRootState } from "../../../state";
import { useSelector } from "react-redux";
import { type EntitySearchableSelectParams, SearchableSelect } from "./searchableSelect";

export function RolesSearchableSelect(
  { id, disabled, isInvalid, onValueChange }: EntitySearchableSelectParams<Role>
)
{
  const roleState = useSelector((state: YusrRootState) => state.role);
  const dispatch = useAppDispatch();

  return (
    <SearchableSelect<Role>
      items={ roleState.entities?.data ?? [] }
      itemLabelKey="name"
      itemValueKey="id"
      value={ id?.toString() || "" }
      columnsNames={ RoleFilterColumns.columnsNames }
      onSearch={ (condition) => dispatch(RoleSlice.entityActions.filter(condition)) }
      isLoading={ roleState.isLoading }
      disabled={ roleState.isLoading || disabled }
      isInvalid={ isInvalid }
      onValueChange={ (val) =>
      {
        const selected = (roleState.entities?.data)?.find(
          (t: Role) => t.id.toString() === val
        );
        if (selected)
        {
          onValueChange(selected);
        }
      } }
    />
  );
}
