import { useSelector } from "react-redux";
import { YusrSystemPermissionsResources } from "../../../auth";
import { RoleOld, RoleSlice } from "../../../entities";
import { RolesApiServiceOld } from "../../../networking";
import { type YusrRootState } from "../../../state";
import { ChangableSearchableSelect } from "./changableSearchableSelect";
import { type BasicSearchableSelectParamsOld } from "./searchableSelectOld";

export function RolesSearchableSelectOld(
  { ...props }: BasicSearchableSelectParamsOld<RoleOld>
)
{
  const roleState = useSelector((state: YusrRootState) => state.role);
  const authState = useSelector((state: YusrRootState) => state.auth);

  return (
    <ChangableSearchableSelect<RoleOld>
      labelKey="name"
      createKey="name"
      mode="inline"
      state={ roleState }
      apiService={ new RolesApiServiceOld() }
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
