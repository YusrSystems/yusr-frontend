import { AuthService, Branch, User } from "yusr-ui";
import { Setting, type SettingDto } from "../data/setting";


export class ErpAuthService extends AuthService
{
	private _settingStorageItemName = "Setting";

	private _setting: Setting | undefined;

	get setting(): Setting | undefined
	{
		if (!this._setting)
		{
			const storedSettingString = localStorage.getItem(this._settingStorageItemName);
			const storedSetting: SettingDto = storedSettingString ? JSON.parse(storedSettingString) : undefined;
			if (storedSetting == undefined)
			{
				return undefined;
			}
			this._setting = new Setting(storedSetting);
			return this._setting;
		}
		return this._setting;
	}

	get isVerifiedAccount(): boolean
	{
		return Boolean(this.setting?.companyPhone?.value && this.setting?.branch?.value?.cityId.value);
	}

	get stepsToComplete(): number
	{
		let counter = 0;

		if (!this.setting?.companyPhone?.value)
		{
			counter += 1;
		}
		if (!this.setting?.branch?.value?.cityId.value)
		{
			counter += 1;
		}

		return counter;
	}

	get nextRoute(): string
	{
		if (!this.setting?.branch?.value?.cityId.value)
		{
			return "/branches";
		}
		if (!this.setting?.companyPhone?.value)
		{
			return "/settings";
		}
		return "/";
	}

	setSettings(dto: SettingDto)
	{
		this._setting = new Setting(dto);
	}

	updateBranch(branch: Branch)
	{
		if (branch.id.value !== this.setting?.branch?.value?.id.value && this._setting?.branch.value)
		{
			this._setting.branch.value = branch;
			localStorage.setItem(this._settingStorageItemName, JSON.stringify(this._setting));
		}
	}

	readonly login = (user: User, setting: Setting) =>
	{
		this.baseLogin(user);
		this._setting = setting;
		localStorage.setItem(this._settingStorageItemName, JSON.stringify(setting));
	};

	readonly logout = () =>
	{
		this.baseLogout();
		this._setting = undefined;
		localStorage.removeItem(this._settingStorageItemName);
	};

	readonly syncFromStorage = () =>
	{
		this.baseSyncFromStorage();
		this._setting = this.setting;
	};
}
