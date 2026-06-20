import { AuthService, Branch, User } from "yusr-ui";
import { Setting, type SettingDto } from "../data/setting";
import { signal } from "@preact/signals-react";


export class ErpAuthService extends AuthService
{
	private _settingStorageItemName = "Setting";

	private _settingSignal = signal<Setting | undefined>(undefined);

	get setting(): Setting | undefined
	{
		if (!this._settingSignal.value)
		{
			this._settingSignal.value = this.readSettingFromStorage();
		}
		return this._settingSignal.value;
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

	readonly setSettings = (dto: SettingDto) =>
	{
		this._settingSignal.value = new Setting(dto);
	};

	readonly updateBranch = (branch: Branch) =>
	{
		if (branch.id.value === this._settingSignal?.value?.branchId?.value)
		{
			this._settingSignal.value.branch.value = branch;
			localStorage.setItem(this._settingStorageItemName, JSON.stringify(this._settingSignal.value));
		}
	};

	readonly login = (user: User, setting: Setting) =>
	{
		this.baseLogin(user);
		this._settingSignal.value = setting;
		localStorage.setItem(this._settingStorageItemName, JSON.stringify(setting));
	};

	readonly logout = () =>
	{
		this.baseLogout();
		this._settingSignal.value = undefined;
		localStorage.removeItem(this._settingStorageItemName);
	};

	readonly syncFromStorage = () =>
	{
		this.baseSyncFromStorage();
		this._settingSignal.value = this.readSettingFromStorage();
	};

	private readSettingFromStorage(): Setting | undefined
	{
		const storedSettingString = localStorage.getItem(this._settingStorageItemName);
		const storedSetting: SettingDto | undefined = storedSettingString
			? JSON.parse(storedSettingString)
			: undefined;
		return storedSetting ? new Setting(storedSetting) : undefined;
	}
}
