import type { TFunction } from "i18next";
import { ApiConstants, type RequestResult, YusrApiHelper } from "yusr-ui";
import type { Setting } from "../data/setting";

export default class SettingsApiService
{
  routeName: string = "Settings";

  async Get(): Promise<RequestResult<Setting>>
  {
    return await YusrApiHelper.Get(`${ApiConstants.baseUrl}/${this.routeName}/Get`);
  }

  async Update(entity: Setting, t: TFunction<"common">)
  {
    return await YusrApiHelper.Put(
      `${ApiConstants.baseUrl}/${this.routeName}/Update`,
      entity,
      undefined,
      t("api.updateSuccess")
    );
  }
}
