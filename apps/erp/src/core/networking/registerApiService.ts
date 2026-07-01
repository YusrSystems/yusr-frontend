import { Registration, type RegistrationDto } from "@/core/data/registration.ts";
import { BaseApiService, type RequestResult, YusrApiHelper } from "yusr-ui";


export class RegisterApiService extends BaseApiService<RegistrationDto>
{
	routeName: string = "Register";

	async register(data: Registration): Promise<RequestResult<boolean>>
	{
		return await YusrApiHelper.Post(
			`/api/${ this.routeName }`,
			data.toJson()
		);
	}
}
