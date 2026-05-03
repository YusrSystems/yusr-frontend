import { ApiConstants, YusrApiHelper, type RequestResult } from "yusr-ui";

export default class SystemApiService
{
  routeName: string = "System";

  async GetSystemPermissions(): Promise<RequestResult<string[]>>
  {
    return await YusrApiHelper.Get(`${ApiConstants.baseUrl}/${this.routeName}/Permissions`);
  }
}
