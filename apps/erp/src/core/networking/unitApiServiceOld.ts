import { ApiConstants, BaseApiServiceOld, type RequestResult, YusrApiHelper } from "yusr-ui";
import type ServiceIds from "../data/serviceIds";
import type UnitOld from "../data/unitOld";

export default class UnitsApiServiceOld extends BaseApiServiceOld<UnitOld>
{
  routeName: string = "Units";

  async GetServiceIds(): Promise<RequestResult<ServiceIds>>
  {
    return await YusrApiHelper.Get(`${ApiConstants.baseUrl}/${this.routeName}/ServiceIds`);
  }
}
