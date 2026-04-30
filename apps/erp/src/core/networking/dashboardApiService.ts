import { ApiConstants, BaseFilterableApiService, YusrApiHelper, type RequestResult } from "yusr-core";
import type DashboardData from "../data/dashboardData";

export default class DashboardApiService extends BaseFilterableApiService<DashboardData>
{
  routeName: string = "dashboard";

  async get(): Promise<RequestResult<DashboardData>>
  {
    const url = `${ApiConstants.baseUrl}/${this.routeName}`;
    return await YusrApiHelper.Get<DashboardData>(url);
  }
}
