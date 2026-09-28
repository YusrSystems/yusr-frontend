import { Cubit, type ThemeSettings } from "yusr-ui";
import {
	SettingsError,
	SettingsInitial,
	SettingsLoading,
	SettingsSaving,
	type SettingsState
} from "@/features/setting/logic/settingsState.ts";
import { Setting } from "@/core/data/setting.ts";
import { Signal, signal } from "@preact/signals-react";
import { Services } from "@/core/services/services.ts";
import { settingsApi } from "../settings.api";


export default class SettingsCubit extends Cubit<SettingsState>
{
	public formData = new Setting({});
	public activeTab = signal<"basic" | "invoicing" | "eInvoicing" | "accounts" | "theme">("basic");

	constructor()
	{
		super(SettingsInitial);
	}

	public async init()
	{
		this.emit(new SettingsLoading());
		const response = await settingsApi.get();

		if (response.ok && response.data)
		{
			this.formData = new Setting(response.data);
			this.emit(new SettingsInitial());
			return;
		}

		this.emit(new SettingsError());
	}

	public async save(draftTheme: Signal<ThemeSettings | undefined>)
	{
		if (!this.formData.validate())
		{
			this.activeTab.value = "basic";
			return;
		}

		this.emit(new SettingsSaving());
		const result = await settingsApi.update(this.formData.toJson());

		if (result.ok && result.data)
		{
			Services.auth.setSettings(result.data);
			draftTheme.value = undefined;
			this.emit(new SettingsInitial());
			return;
		}

		this.emit(new SettingsError());
	}
}