import { BaseApiService, type RequestResult, YusrApiHelper } from "yusr-ui";
import type ServiceIds from "../data/serviceIds";
import type { UnitDto } from "../data/unit";


export default class UnitsApiService extends BaseApiService<UnitDto>
{

	constructor(routeName: string)
	{
		super(routeName);
	}

	async GetServiceIds(): Promise<RequestResult<ServiceIds>>
	{
		return await YusrApiHelper.Get(`/api/${ this.routeName }/ServiceIds`);
	}
}
