import { AppNavigator } from "@/app/appNavigator";
import { Setting } from "@/core/data/setting";
import type { SettingOld } from "@/core/data/settingOld";
import { RegisterApiService } from "@/core/networking/registerApiService";
import { Services } from "@/core/services/services";
import { ApiConstants, Cubit, User, UserOld, YusrApiHelper } from "yusr-ui";
import { Registration } from "../data/registration";
import { type RegistrationState, RegistrationStateError, RegistrationStateInitial } from "./registrationState";

export class RegistrationCubit extends Cubit<RegistrationState>
{
  public formData: Registration = new Registration({
    companyName: "",
    email: "",
    userPassword: "",
    currencyId: 1,
    username: "",
    id: 0
  });

  constructor()
  {
    super(new RegistrationStateInitial());
  }

  public async register()
  {
    console.log("=========== start register ===========");
    console.log("validating . . .");

    if (!this.formData.validate())
    {
      return;
    }
    console.log("=========== validated ===========");
    const service = new RegisterApiService();

    console.log("sending to backend");
    const result = await service.register(this.formData);
    console.log(result);
  }

  public async externalAuthRegister(token: string)
  {
    console.log(token);

    const result = await YusrApiHelper.Post<{ user: UserOld; setting: SettingOld; }>(
      `${ApiConstants.baseUrl}/Login/external-login`,
      {
        provider: "google",
        token
      }
    );
    console.log(result);

    if (result.status === 200 && result.data)
    {
      Services.auth.login(new User(result.data.user), new Setting(result.data.setting));
      AppNavigator.navigate("/dashboard", true);
      return;
    }
    else
    {
      this.emit(new RegistrationStateError());
    }
  }
}
