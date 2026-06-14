import { ApiConstants, BaseFilterableApiServiceOld, type RequestResult, YusrApiHelper } from "yusr-ui";
import type DashboardDataOld from "../data/dashboardDataOld.ts";

export default class DashboardApiServiceOld extends BaseFilterableApiServiceOld<DashboardDataOld>
{
  routeName: string = "dashboard";

  async get(): Promise<RequestResult<DashboardDataOld>>
  {
    const url = `${ApiConstants.baseUrl}/${this.routeName}`;
    return await YusrApiHelper.Get<DashboardDataOld>(url);
  }
}
