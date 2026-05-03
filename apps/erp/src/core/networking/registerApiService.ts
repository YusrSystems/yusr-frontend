import { ApiConstants, BaseApiService, type RequestResult, YusrApiHelper } from "yusr-ui";
import type Registration from "../data/registration";

export default class RegisterApiService extends BaseApiService<Registration>
{
  routeName: string = "Register";

  async register(data: Registration): Promise<RequestResult<boolean>>
  {
    return await YusrApiHelper.Post(
      `${ApiConstants.baseUrl}/${this.routeName}`,
      data
    );
  }
}
