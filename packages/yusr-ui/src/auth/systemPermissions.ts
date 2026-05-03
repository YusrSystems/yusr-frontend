import { AuthConstants } from "./authConstants";

export class SystemPermissions
{
  static hasAuth(permissions: string[], resource: string, action: string)
  {
    const formattedPermissions = AuthConstants.FormatFunc(resource, action);
    return permissions.includes(formattedPermissions);
  }

  private permissions: string[];
  private resource: string;

  constructor(permissions: string[], resource: string)
  {
    this.permissions = permissions;
    this.resource = resource;
  }

  public hasAuth(action: string): boolean
  {
    return SystemPermissions.hasAuth(this.permissions, this.resource, action);
  }
}
