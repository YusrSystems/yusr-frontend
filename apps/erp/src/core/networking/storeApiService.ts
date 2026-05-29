import { ApiConstants, BaseApiService, type FilterResult, type RequestResult, YusrApiHelper } from "yusr-ui";
import type Store from "../data/store";

export default class StoresApiService extends BaseApiService<Store>
{
  routeName: string = "Stores";

  async FilterAll(
    pageNumber: number,
    rowsPerPage: number,
    searchText?: string
  ): Promise<RequestResult<FilterResult<Store>>>
  {
    return await YusrApiHelper.Post(
      `${ApiConstants.baseUrl}/${this.routeName}/FilterAll?pageNumber=${pageNumber}&rowsPerPage=${rowsPerPage}`,
      searchText
    );
  }
}
