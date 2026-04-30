import { ApiConstants, YusrApiHelper, type RequestResult } from "yusr-core";
import type { Tenant } from "../data/tenant";

export default class SystemApiService
{
  routeName: string = "System";

  async GetSystemPermissions(): Promise<RequestResult<string[]>>
  {
    return await YusrApiHelper.Get(`${ApiConstants.baseUrl}/${this.routeName}/Permissions`);
  }

  async GetTenantInfo(key: string): Promise<RequestResult<Tenant>>
  {
    return await YusrApiHelper.Get(`${ApiConstants.baseUrl}/${this.routeName}/TenantInfo?key=${key}`);
  }
}
