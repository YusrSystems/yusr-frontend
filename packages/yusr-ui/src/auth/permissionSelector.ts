import type { YusrRootState } from "../state";

export interface ResourcePermissions
{
  getPermission: boolean;
  addPermission: boolean;
  updatePermission: boolean;
  deletePermission: boolean;
}

export type PermissionSelector<S = YusrRootState> = (state: S, resource: string) => ResourcePermissions;
