export interface ResourcePermissions {
  getPermission: boolean;
  addPermission: boolean;
  updatePermission: boolean;
  deletePermission: boolean;
}

export type PermissionSelector<S> = (state: S, resource: string) => ResourcePermissions;