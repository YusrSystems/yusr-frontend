import { AuthConstants, User, UserDto } from "../index";

export abstract class AuthService
{
  private _isAuthenticated = false;
  private _loggedInUser: User | undefined;

  get loggedInUser(): User | undefined
  {
    if (!this._loggedInUser)
    {
      const storedItemString = localStorage.getItem(AuthConstants.LoggedInUserStorageItemName);
      const storedItem: UserDto = storedItemString ? JSON.parse(storedItemString) : undefined;
      if (storedItem == undefined)
      {
        return undefined;
      }
      this._loggedInUser = new User(storedItem);
      return this._loggedInUser;
    }
    return this._loggedInUser;
  }

  get isAuthenticated(): boolean
  {
    this._isAuthenticated = localStorage.getItem(AuthConstants.AuthCheckStorageItemName) === "true";
    return this._isAuthenticated;
  }

  protected readonly baseLogin = (user: User) =>
  {
    this._isAuthenticated = true;
    this._loggedInUser = user;

    localStorage.setItem(AuthConstants.AuthCheckStorageItemName, "true");
    localStorage.setItem(AuthConstants.LoggedInUserStorageItemName, JSON.stringify(user.toJson()));
  };

  protected readonly baseLogout = () =>
  {
    this._isAuthenticated = false;
    this._loggedInUser = undefined;

    localStorage.removeItem(AuthConstants.AuthCheckStorageItemName);
    localStorage.removeItem(AuthConstants.LoggedInUserStorageItemName);
  };

  protected readonly baseSyncFromStorage = () =>
  {
    this._isAuthenticated = this.isAuthenticated;
    this._loggedInUser = this.loggedInUser;
  };

  FormatFunc = (resource: string, action: string) =>
  {
    return `${resource}.${action}`;
  };

  readonly hasAuth = (resource: string, action: string): boolean =>
  {
    const formattedPermissions = AuthConstants.FormatFunc(resource, action);
    if (this.loggedInUser == undefined)
    {
      return false;
    }
    return this.loggedInUser?.role.value.permissions.includes(formattedPermissions);
  };
}
