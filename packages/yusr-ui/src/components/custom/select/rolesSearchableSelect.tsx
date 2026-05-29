import { useSelector } from "react-redux";
import { YusrSystemPermissionsResources } from "../../../auth";
import { Role, RoleSlice } from "../../../entities";
import { RolesApiService } from "../../../networking";
import { type YusrRootState } from "../../../state";
import { ChangableSearchableSelect } from "./changableSearchableSelect";
import { type BasicSearchableSelectParams } from "./searchableSelect";

export function RolesSearchableSelect(
  { ...props }: BasicSearchableSelectParams<Role>
)
{
  const roleState = useSelector((state: YusrRootState) => state.role);
  const authState = useSelector((state: YusrRootState) => state.auth);

  return (
    <ChangableSearchableSelect<Role>
      labelKey="name"
      createKey="name"
      mode="inline"
      state={ roleState }
      apiService={ new RolesApiService() }
      systemPermissionsResources={ YusrSystemPermissionsResources.Roles }
      allowAdd={ false }
      allowUpdate={ false }
      entityActions={ {
        filter: RoleSlice.entityActions.filter,
        refresh: RoleSlice.entityActions.refresh
      } }
      authPermissions={ authState.loggedInUser?.role?.permissions ?? [] }
      { ...props }
    />
  );
}
