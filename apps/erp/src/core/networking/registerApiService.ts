import { Registration, type RegistrationDto } from "@/core/data/registration.ts";
import { BaseApiService, type RequestResult, YusrApiHelper } from "yusr-ui";


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
			`/api/${ this.routeName }`,
			data.toJson()
		);
	}
}
