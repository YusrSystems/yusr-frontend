import { RoleSlice } from "@/core/data/role";
import ChangeRoleDialog from "@/features/roles/changeRoleDialog";
import { Role, RoleFilterColumns, RolesApiService } from "yusr-core";
import type { EntitySearchableSelectParams } from "yusr-ui";
import ChangableSearchableSelect from "../../../../../../packages/yusr-ui/src/components/custom/select/changableSearchableSelect";
import { SystemPermissionsResources } from "../../auth/systemPermissionsResources";
import { useAppSelector } from "../../state/store";

export default function RolesSearchableSelect(
  { id, disabled, isInvalid, onValueChange }: EntitySearchableSelectParams<Role>
)
{
  const roleState = useAppSelector((state) => state.role);

  return (
    <ChangableSearchableSelect<Role>
      id={ id }
      itemLabelKey="name"
      itemValueKey="id"
      state={ roleState }
      apiService={ new RolesApiService() }
      columnsNames={ RoleFilterColumns.columnsNames }
      disabled={ disabled }
      isInvalid={ isInvalid }
      systemPermissionsResources={ SystemPermissionsResources.Roles }
      onValueChange={ onValueChange }
      entityActions={ {
        filter: RoleSlice.entityActions.filter,
        refresh: RoleSlice.entityActions.refresh
      } }
      createEntity={ (con) =>
      {
        return { name: con.value } as Role;
      } }
      changeDialog={ ChangeRoleDialog }
    />
  );
}
