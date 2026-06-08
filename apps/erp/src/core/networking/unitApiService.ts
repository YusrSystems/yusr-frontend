import { ApiConstants, BaseApiService, type RequestResult, YusrApiHelper } from "yusr-ui";
import type ServiceIds from "../data/serviceIds";
import type { UnitDto } from "../data/unit";
import Unit from "../data/unit";

export default class UnitsApiService extends BaseApiService<Unit, UnitDto>
{
  routeName: string = "Units";

  override createEntity(dto: UnitDto): Unit
  {
    return new Unit(dto);
  }

  async GetServiceIds(): Promise<RequestResult<ServiceIds>>
  {
    return await YusrApiHelper.Get(`${ApiConstants.baseUrl}/${this.routeName}/ServiceIds`);
  }
}
