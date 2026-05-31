import { ApiConstants, BaseFilterableApiServiceOld, type RequestResult, YusrApiHelper } from "yusr-ui";
import type DashboardData from "../data/dashboardData";

export default class DashboardApiService extends BaseFilterableApiServiceOld<DashboardData>
{
  routeName: string = "dashboard";

  async get(): Promise<RequestResult<DashboardData>>
  {
    const url = `${ApiConstants.baseUrl}/${this.routeName}`;
    return await YusrApiHelper.Get<DashboardData>(url);
  }
}
