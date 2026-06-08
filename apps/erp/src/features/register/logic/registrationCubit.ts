import { AppNavigator } from "@/app/appNavigator";
import { Setting, SettingDto } from "@/core/data/setting";
import { RegisterApiService } from "@/core/networking/registerApiService";
import { Services } from "@/core/services/services";
import { ApiConstants, Cubit, User, UserDto, YusrApiHelper } from "yusr-ui";
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
    branchName: "",
    id: 0
  });

  constructor()
  {
    super(new RegistrationStateInitial());
  }

  public async register()
  {
    if (!this.formData.validate())
    {
      return;
    }
    const service = new RegisterApiService();

    const result = await service.register(this.formData);
    console.log(result);
  }

  public async externalAuthRegister(
    token: string,
    additionalFunc?: (
      result: {
        user: UserDto;
        setting: SettingDto;
      }
    ) => void
  )
  {
    const result = await YusrApiHelper.Post<{ user: UserDto; setting: SettingDto; }>(
      `${ApiConstants.baseUrl}/Login/external-login`,
      {
        provider: "google",
        token
      }
    );

    if (result.status === 200 && result.data)
    {
      Services.auth.login(new User(result.data.user), new Setting(result.data.setting));
      AppNavigator.navigate("/dashboard", true);
      additionalFunc?.(result.data);
      return;
    }
    else
    {
      this.emit(new RegistrationStateError());
    }
  }
}
