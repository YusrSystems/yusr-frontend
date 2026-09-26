import { AppNavigator } from "@/app/appNavigator";
import { Setting, type SettingDto } from "@/core/data/setting";
import { Services } from "@/core/services/services";
import { apiClient, Cubit, User, type UserDto } from "yusr-ui";
import { Registration } from "@/core/data/registration.ts";
import { type RegistrationState, RegistrationStateInitial, RegistrationStateLoading } from "./registrationState";


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

	public joinedByKey?: string;

	constructor(joinedByKey: string | undefined)
	{
		super(new RegistrationStateInitial());
		this.joinedByKey = joinedByKey;
		this.formData.joinedByKey.value = this.joinedByKey;
	}

	public async register()
	{
		if (!this.formData.validate() || !this.formData.hasAcceptedPolicies.value)
		{
			return;
		}

		this.emit(new RegistrationStateLoading());

		const result = await apiClient.post<{ user: UserDto; setting: SettingDto }>(
			"/api/Register",
			this.formData.toJson()
		);

		if (result.ok && result.data)
		{
			Services.auth.login(new User(result.data.user), new Setting(result.data.setting));
			await AppNavigator.navigate("/dashboard", true);
			return;
		}

		this.emit(new RegistrationStateInitial());
	}

	public async externalAuthRegister(token: string)
	{
		this.emit(new RegistrationStateLoading());

		const result = await apiClient.post<{ user: UserDto; setting: SettingDto }>(
			"/api/Login/external-login",
			{
				provider: "google",
				token,
				joinedByKey: this.joinedByKey
			}
		);

		if (result.ok && result.data)
		{
			Services.auth.login(new User(result.data.user), new Setting(result.data.setting));
			await AppNavigator.navigate("/dashboard", true);
			return;
		}

		this.emit(new RegistrationStateInitial());
	}
}