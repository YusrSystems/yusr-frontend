import { Cubit } from "yusr-ui";
import {
	SettingsError,
	SettingsInitial,
	SettingsLoading,
	SettingsSaving,
	type SettingsState
} from "@/features/setting/logic/settingsState.ts";
import { Setting, SettingDto } from "@/core/data/setting.ts";
import SettingsApiServiceOld from "@/core/networking/settingsApiServiceOld.ts";
import { signal } from "@preact/signals-react";
import { Services } from "@/core/services/services.ts";


export default class SettingsCubit extends Cubit<SettingsState>
{
	public formData = new Setting({});
	public activeTab = signal<"basic" | "invoicing" | "accounts" | "subscription">("basic");

	constructor()
	{
		super(SettingsInitial);
	}

	public async init()
	{
		try
		{
			this.emit(new SettingsLoading());
			const response = await new SettingsApiServiceOld().Get();
			if (response.data)
			{
				console.log("Settings Data ", response.data);
				this.formData = new Setting(response.data);
			}
			else
			{
				this.emit(new SettingsError());
			}
		}
		catch
		{
			this.emit(new SettingsError());
		}
	}

	public async save()
	{
		try
		{
			if (!this.formData.validate())
			{
				this.activeTab.value = "basic";
				return;
			}

			this.emit(new SettingsSaving());
			const result = await new SettingsApiServiceOld().Update(
				this.formData.toJson()
			);
			if (result.data)
			{
				Services.auth.setSettings(result.data as SettingDto);

				this.emit(new SettingsInitial());
			}
			else
			{
				this.emit(new SettingsError());
			}

		}
		catch
		{
			this.emit(new SettingsError());
		}
	}
}