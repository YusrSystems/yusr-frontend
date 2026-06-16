import type { TFunction } from "i18next";
import { ApiConstants, type RequestResult, YusrApiHelper } from "yusr-ui";
import type { SettingOld, SharingSetting } from "../data/settingOld";


export default class SettingsApiServiceOld
{
	routeName: string = "Settings";

	async Get(): Promise<RequestResult<SettingOld>>
	{
		return await YusrApiHelper.Get(`${ ApiConstants.baseUrl }/${ this.routeName }/Get`);
	}

	async GetForSharing(registrationKey: string): Promise<RequestResult<SharingSetting>>
	{
		return await YusrApiHelper.Get(`${ ApiConstants.baseUrl }/${ this.routeName }/Get/${ registrationKey }`);
	}

	async Update(entity: SettingOld, t: TFunction<"common">)
	{
		return await YusrApiHelper.Put(
			`${ ApiConstants.baseUrl }/${ this.routeName }/Update`,
			entity,
			undefined,
			t("api.updateSuccess")
		);
	}
}
