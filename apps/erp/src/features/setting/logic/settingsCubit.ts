import { Cubit } from "yusr-ui";
import { SettingsInitial, type SettingsState } from "@/features/setting/logic/settingsState.ts";
import { Setting } from "@/core/data/setting.ts";


export default class SettingsCubit extends Cubit<SettingsState>
{
	public formData = new Setting({});

	constructor()
	{
		super(SettingsInitial);
	}

	public init()
	{

	}
}