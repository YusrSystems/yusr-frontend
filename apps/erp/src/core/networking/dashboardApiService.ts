import {ApiConstants, BaseApiService, type RequestResult, YusrApiHelper} from "yusr-ui";
import { DashboardData, DashboardDataDto} from "@/core/data/dashboardData.ts";

export default class DashboardApiService extends BaseApiService<DashboardData, DashboardDataDto>
{
    routeName: string = "dashboard";

    async get(): Promise<RequestResult<DashboardData>>
    {
        const url = `${ApiConstants.baseUrl}/${this.routeName}`;
        return await YusrApiHelper.Get<DashboardData>(url);
    }


    override createEntity(dto: DashboardDataDto): DashboardData
    {
        return new DashboardData(dto);
    }
}