import type { YusrRootState } from "../state";
import { createSelector } from "@reduxjs/toolkit";
import type { PermissionSelector } from "./permissionSelector";
import { SystemPermissions } from "./systemPermissions";
import { SystemPermissionsActions } from "./systemPermissionsActions";

const selectRawPermissions = (state: YusrRootState) => state.auth.loggedInUser?.role?.permissions || [];

export const selectPermissionsByResource: PermissionSelector = createSelector(
  [selectRawPermissions, (_state: YusrRootState, resource: string) => resource],
  (permissions, resource) =>
  {
    const systemPermissions = new SystemPermissions(permissions, resource);

    return {
      getPermission: systemPermissions.hasAuth(SystemPermissionsActions.Get),
      addPermission: systemPermissions.hasAuth(SystemPermissionsActions.Add),
      updatePermission: systemPermissions.hasAuth(SystemPermissionsActions.Update),
      deletePermission: systemPermissions.hasAuth(SystemPermissionsActions.Delete)
    };
  }
);
