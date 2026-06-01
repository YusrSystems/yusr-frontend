import type { User } from "../index";

export class CurrentUserService
{
  private static _currentUser: User;
  public static get CurrentUser(): User
  {
    if (!this._currentUser)
    {
      throw new Error("Current user is not set");
    }
    return this._currentUser;
  }

  public static set CurrentUser(user: User)
  {
    this._currentUser = user;
  }
}
