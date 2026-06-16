import type { TFunction } from "i18next";
import { ApiConstants, type RequestResult, YusrApiHelper } from "yusr-ui";
import type { SettingDto, SharingSetting } from "../data/setting";


export default class SettingsApiServiceOld
{
	routeName: string = "Settings";

	async Get(): Promise<RequestResult<SettingDto>>
	{
		return await YusrApiHelper.Get<SettingDto>(`${ ApiConstants.baseUrl }/${ this.routeName }/Get`);
	}

	async GetForSharing(registrationKey: string): Promise<RequestResult<SharingSetting>>
	{
		return await YusrApiHelper.Get(`${ ApiConstants.baseUrl }/${ this.routeName }/Get/${ registrationKey }`);
	}

	async Update(entity: SettingDto, t: TFunction<"common">)
	{
		return await YusrApiHelper.Put(
			`${ ApiConstants.baseUrl }/${ this.routeName }/Update`,
			entity,
			undefined,
			t("api.updateSuccess")
		);
	}
}
