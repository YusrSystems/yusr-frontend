import { AuthConstants, type Dto, type Entity } from "../index";

export class AuthService<
  TUser extends Entity<TUserDto>,
  TUserDto extends Dto,
  TSetting extends Entity<TSettingDto>,
  TSettingDto extends Dto
>
{
  private _isAuthenticated = false;
  private _loggedInUser: TUser | undefined;
  private _setting: TSetting | undefined;

  get loggedInUser(): TUser
  {
    if (!this._loggedInUser)
    {
      throw new Error("_loggedInUser is not set");
    }
    return this._loggedInUser;
  }

  get setting(): TSetting
  {
    if (!this._setting)
    {
      throw new Error("_setting is not set");
    }
    return this._setting;
  }

  get isAuthenticated(): boolean
  {
    return this._isAuthenticated;
  }

  login(user: TUser, setting: TSetting)
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
}
