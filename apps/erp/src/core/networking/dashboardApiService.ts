import { BaseApiService, type RequestResult, YusrApiHelper } from "yusr-ui";
import { DashboardDataDto } from "@/core/data/dashboardData.ts";


export default class DashboardApiService extends BaseApiService<DashboardDataDto>
{
	constructor()
	{
		super("dashboard");
	}

	async get(): Promise<RequestResult<DashboardDataDto>>
	{
		const url = `/api/${ this.routeName }`;
		return await YusrApiHelper.Get<DashboardDataDto>(url);
	}

}