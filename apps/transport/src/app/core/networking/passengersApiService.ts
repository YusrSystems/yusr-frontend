import type { Passenger } from "@/app/features/passengers/data/passenger";
import { ApiConstants, BaseApiService, type RequestResult, YusrApiHelper } from "yusr-ui";

export default class PassengersApiService extends BaseApiService<Passenger>
{
  routeName: string = "Passengers";

  async SelfRegister(key: string, passenger: Passenger): Promise<RequestResult<boolean>>
  {
    return await YusrApiHelper.Post(`${ApiConstants.baseUrl}/${this.routeName}/SelfRegister?key=${key}`, passenger);
  }
}
