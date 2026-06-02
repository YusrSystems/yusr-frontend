import { AuthConstants, type Dto, type Entity, User, UserDto } from "../index";

export class AuthService<
  TSetting extends Entity<TSettingDto>,
  TSettingDto extends Dto
>
{
  private _isAuthenticated = false;
  private _loggedInUser: User | undefined;
  private _setting: TSetting | undefined;
  private _createSetting: (dto: TSettingDto) => TSetting;

  constructor(createSetting: (dto: TSettingDto) => TSetting, formatFunc?: (resource: string, action: string) => string)
  {
    this._createSetting = createSetting;
    if (formatFunc)
    {
      this.FormatFunc = formatFunc;
    }
  }

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

  get setting(): TSetting | undefined
  {
    if (!this._setting)
    {
      const storedSettingString = localStorage.getItem(AuthConstants.SettingStorageItemName);
      const storedSetting: TSettingDto = storedSettingString ? JSON.parse(storedSettingString) : undefined;
      if (storedSetting == undefined)
      {
        return undefined;
      }
      this._setting = this._createSetting(storedSetting);
      return this._setting;
    }
    return this._setting;
  }

  get isAuthenticated(): boolean
  {
    return this._isAuthenticated;
  }

  login(user: User, setting: TSetting)
  {
    this._isAuthenticated = true;
    this._loggedInUser = user;
    this._setting = setting;

    localStorage.setItem(AuthConstants.AuthCheckStorageItemName, "true");
    localStorage.setItem(AuthConstants.LoggedInUserStorageItemName, JSON.stringify(user.toJson()));
    localStorage.setItem(AuthConstants.SettingStorageItemName, JSON.stringify(setting.toJson()));
  }

  logout()
  {
    this._isAuthenticated = false;
    this._loggedInUser = undefined;
    this._setting = undefined;

    localStorage.removeItem(AuthConstants.AuthCheckStorageItemName);
    localStorage.removeItem(AuthConstants.LoggedInUserStorageItemName);
    localStorage.removeItem(AuthConstants.SettingStorageItemName);
  }

  FormatFunc = (resource: string, action: string) =>
  {
    return `${resource}.${action}`;
  };

  hasAuth(resource: string, action: string): boolean
  {
    const formattedPermissions = AuthConstants.FormatFunc(resource, action);
    if (this.loggedInUser == undefined)
    {
      return false;
    }
    return this.loggedInUser?.role.value.permissions.includes(formattedPermissions);
  }
}
