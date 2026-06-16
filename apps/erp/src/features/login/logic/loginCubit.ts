import { AppNavigator } from "@/app/appNavigator";
import { Setting, SettingDto } from "@/core/data/setting";
import { Services } from "@/core/services/services";
import { signal } from "@preact/signals-react";
import { Cubit, LoginRequest, User, UserDto, YusrApiHelper } from "yusr-ui";
import { LoginInitialState, LoginLoadingState } from "./loginState";


const emailStorageItemName = "loginEmail";
const usernameStorageItemName = "loginUsername";

export default class LoginCubit extends Cubit<LoginInitialState>
{
	private readonly _origin: string;
	public formData = new LoginRequest({
		companyEmail: localStorage.getItem(emailStorageItemName) ?? "",
		username: localStorage.getItem(usernameStorageItemName) ?? "",
		password: ""
	});
	public rememberMe = signal(
		!!(localStorage.getItem(emailStorageItemName) || localStorage.getItem(usernameStorageItemName))
	);

	constructor(origin: string)
	{
		super(new LoginInitialState());
		this._origin = origin;
	}

	public async login()
	{
		if (!this.formData.validate())
		{
			return;
		}

		this.performRememberMe();
		this.emit(new LoginLoadingState());

		const result = await YusrApiHelper.Post<{ user: UserDto; setting: SettingDto; }>(
			`/api/Login`,
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
			this.emit(new LoginInitialState());
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
