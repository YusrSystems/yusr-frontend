import { ApiConstants, BaseApiServiceOld, type RequestResult, YusrApiHelper } from "yusr-ui";
import type ServiceIds from "../data/serviceIds";
import type Unit from "../data/unit";

export default class UnitsApiService extends BaseApiServiceOld<Unit>
{
  routeName: string = "Units";

  async GetServiceIds(): Promise<RequestResult<ServiceIds>>
  {
    return await YusrApiHelper.Get(`${ApiConstants.baseUrl}/${this.routeName}/ServiceIds`);
  }
}
