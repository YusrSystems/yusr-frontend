import type { TFunction } from "i18next";
import { type RequestResult, YusrApiHelper } from "yusr-ui";
import type { SettingDto, SharingSetting } from "../data/setting";


export default class SettingsApiServiceOld
{
	routeName: string = "Settings";

	async Get(): Promise<RequestResult<SettingDto>>
	{
		return await YusrApiHelper.Get<SettingDto>(`$/api/${ this.routeName }/Get`);
	}

	async GetForSharing(registrationKey: string): Promise<RequestResult<SharingSetting>>
	{
		return await YusrApiHelper.Get(`$/api/${ this.routeName }/Get/${ registrationKey }`);
	}

	async Update(entity: SettingDto, t: TFunction<"common">)
	{
		return await YusrApiHelper.Put(
			`$/api/${ this.routeName }/Update`,
			entity,
			undefined,
			t("api.updateSuccess")
		);
	}
}
