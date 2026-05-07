import { ApiConstants, BaseFilterableApiService, type RequestResult, YusrApiHelper } from "yusr-ui";
import { Dashboard } from "../data/dashboard";

export default class DashboardApiService extends BaseFilterableApiService<Dashboard>
{
  routeName: string = "dashboard";

  async get(): Promise<RequestResult<Dashboard>>
  {
    const url = `${ApiConstants.baseUrl}/${this.routeName}`;
    return await YusrApiHelper.Get<Dashboard>(url);
  }
}
