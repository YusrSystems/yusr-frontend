import ChangeRoleDialog from "@/features/roles/changeRoleDialog";
import type { EntitySearchableSelectParams } from "yusr-ui";
import { Role, RoleFilterColumns, RolesApiService, RoleSlice } from "yusr-ui";
import ChangableSearchableSelect from "../../../../../../packages/yusr-ui/src/components/custom/select/changableSearchableSelect";
import { SystemPermissionsResources } from "../../auth/systemPermissionsResources";
import { useAppSelector } from "../../state/store";

export default function RolesSearchableSelect(
  { id, disabled, isInvalid, onValueChange }: EntitySearchableSelectParams<Role>
)
{
  const roleState = useAppSelector((state) => state.role);
  const authState = useAppSelector((state) => state.auth);

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
      changeDialog={ ChangeRoleDialog }
      authPermissions={ authState.loggedInUser?.role?.permissions ?? [] }
    />
  );
}
