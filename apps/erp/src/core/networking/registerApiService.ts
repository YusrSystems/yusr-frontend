import { Registration, type RegistrationDto } from "@/features/register/data/registration";
import { ApiConstants, BaseApiService, BaseApiServiceOld, type RequestResult, YusrApiHelper } from "yusr-ui";
import type RegistrationOld from "../data/registration";

export default class RegisterApiServiceOld extends BaseApiServiceOld<RegistrationOld>
{
  routeName: string = "Register";

  async register(data: RegistrationOld): Promise<RequestResult<boolean>>
  {
    return await YusrApiHelper.Post(
      `${ApiConstants.baseUrl}/${this.routeName}`,
      data
    );
  }
}

export class RegisterApiService extends BaseApiService<Registration, RegistrationDto>
{
  routeName: string = "Register";

  public createEntity(dto: RegistrationDto): Registration
  {
    return new Registration(dto);
  }

  async register(data: Registration): Promise<RequestResult<boolean>>
  {
    return await YusrApiHelper.Post(
      `${ApiConstants.baseUrl}/${this.routeName}`,
      data.toJson()
    );
  }
}
