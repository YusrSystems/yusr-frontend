import { AppNavigator } from "@/app/appNavigator";
import { Setting, SettingDto } from "@/core/data/setting";
import { Services } from "@/core/services/services";
import { ApiConstants, Cubit, type RequestResult, User, UserDto, YusrApiHelper } from "yusr-ui";
import { Registration } from "../../../core/data/registration.ts";
import {
  type RegistrationState,
  RegistrationStateError,
  RegistrationStateInitial,
  RegistrationStateLoading
} from "./registrationState";


export class RegistrationCubit extends Cubit<RegistrationState>
{
	public formData: Registration = new Registration({
		companyName: "",
		email: "",
		userPassword: "",
		username: "",
		id: 0
	});

	constructor()
	{
		super(new RegistrationStateInitial());
	}

	public async register(
		additionalFunc?: (
			result: RequestResult<{
				user: UserDto;
				setting: SettingDto;
			}>
		) => void
	)
	{
		if (!this.formData.validate() || !this.formData.hasAcceptedPolicies.value)
		{
			return;
		}
		this.emit(new RegistrationStateLoading());
		try
		{
			const result = await YusrApiHelper.Post<{ user: UserDto; setting: SettingDto; }>(
				`${ ApiConstants.baseUrl }/Register`,
				this.formData.toJson()
			);
			console.log(result.status);
			console.log(result);

			if (result.status === 200 && result.data)
			{
				Services.auth.login(new User(result.data.user), new Setting(result.data.setting));
				AppNavigator.navigate("/dashboard", true);
				additionalFunc?.(result);
				return;
			}
			else
			{
				this.emit(new RegistrationStateError());
			}
		}
		catch (error)
		{
			this.emit(new RegistrationStateError());
		}
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
			`${ ApiConstants.baseUrl }/Login/external-login`,
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
