import { AppNavigator } from "@/appNavigator";
import { Setting } from "@/core/data/setting";
import type { SettingOld } from "@/core/data/settingOld";
import { Services } from "@/services";
import { signal } from "@preact/signals-react";
import { ApiConstants, Cubit, LoginRequest, User, UserOld, YusrApiHelper } from "yusr-ui";
import { LoginInitState, LoginLoadingState, type LoginState } from "./loginState";
const emailStorageItemName = "loginEmail";
const usernameStorageItemName = "loginUsername";
export default class LoginCubit extends Cubit<LoginState>
{
  private _origin: string;
  constructor(origin: string)
  {
    super(new LoginInitState());
    this._origin = origin;
  }
  public formData = new LoginRequest({
    companyEmail: localStorage.getItem(emailStorageItemName) ?? "",
    username: localStorage.getItem(usernameStorageItemName) ?? "",
    password: ""
  });
  public rememberMe = signal(
    !!(localStorage.getItem(emailStorageItemName) || localStorage.getItem(usernameStorageItemName))
  );

  public async login()
  {
    if (!this.formData.validate())
    {
      return;
    }

    this.performRememberMe();
    this.emit(new LoginLoadingState());

    const result = await YusrApiHelper.Post<{ user: UserOld; setting: SettingOld; }>(
      `${ApiConstants.baseUrl}/Login`,
      this.formData.toJson()
    );

    if (result.status === 200 && result.data)
    {
      Services.auth.login(new User(result.data.user), new Setting(result.data.setting));
      AppNavigator.navigate(this._origin, true);
      return;
    }
    else
    {
      this.emit(new LoginInitState());
    }
  }

  private performRememberMe(): void
  {
    if (this.rememberMe.value)
    {
      localStorage.setItem(emailStorageItemName, this.formData.companyEmail.value || "");
      localStorage.setItem(usernameStorageItemName, this.formData.username.value || "");
    }
    else
    {
      localStorage.removeItem(emailStorageItemName);
      localStorage.removeItem(usernameStorageItemName);
    }
  }
}
