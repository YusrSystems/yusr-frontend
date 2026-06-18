import { i18n, type RequestResult, YusrApiHelper } from "yusr-ui";
import type { SettingDto, SharingSetting } from "../data/setting";


export default class SettingsApiServiceOld
{
	routeName: string = "Settings";

	async Get(): Promise<RequestResult<SettingDto>>
	{
		return await YusrApiHelper.Get<SettingDto>(`/api/${ this.routeName }/Get`);
	}

	async GetForSharing(registrationKey: string): Promise<RequestResult<SharingSetting>>
	{
		return await YusrApiHelper.Get(`/api/${ this.routeName }/Get/${ registrationKey }`);
	}

	async Update(entity: SettingDto)
	{
		return await YusrApiHelper.Put(
			`/api/${ this.routeName }/Update`,
			entity,
			undefined,
			i18n.t("api.updateSuccess")
		);
	}
}
