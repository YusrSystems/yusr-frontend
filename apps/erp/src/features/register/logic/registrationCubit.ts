import { AppNavigator } from "@/app/appNavigator";
import { Setting, SettingDto } from "@/core/data/setting";
import { Services } from "@/core/services/services";
import { Cubit, User, UserDto, YusrApiHelper } from "yusr-ui";
import { Registration } from "@/core/data/registration.ts";
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
		id: 0,
		hasAcceptedPolicies: false
	});

	constructor()
	{
		super(new RegistrationStateInitial());
	}

	public async register()
	{
		if (!this.formData.validate() || !this.formData.hasAcceptedPolicies.value)
		{
			return;
		}
		this.emit(new RegistrationStateLoading());
		try
		{
			const result = await YusrApiHelper.Post<{ user: UserDto; setting: SettingDto; }>(
				`/api/Register`,
				this.formData.toJson()
			);

			if (result.status === 200 && result.data)
			{
				Services.auth.login(new User(result.data.user), new Setting(result.data.setting));
				await AppNavigator.navigate("/dashboard", true);
				return;
			}
			else
			{
				this.emit(new RegistrationStateError());
			}
		}
		catch
		{
			this.emit(new RegistrationStateError());
		}
	}

	public async externalAuthRegister(
		token: string)
	{
		const result = await YusrApiHelper.Post<{ user: UserDto; setting: SettingDto; }>(
			`/api/Login/external-login`,
			{
				provider: "google",
				token
			}
		);

		if (result.status === 200 && result.data)
		{
			Services.auth.login(new User(result.data.user), new Setting(result.data.setting));
			await AppNavigator.navigate("/dashboard", true);
			return;
		}
		else
		{
			this.emit(new RegistrationStateError());
		}
	}
}
