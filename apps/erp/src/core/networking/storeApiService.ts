import { ApiConstants, type ApiFilterResult, BaseApiServiceOld, type RequestResult, YusrApiHelper } from "yusr-ui";
import type Store from "../data/store";

export default class StoresApiService extends BaseApiServiceOld<Store>
{
  routeName: string = "Stores";

  async FilterAll(
    pageNumber: number,
    rowsPerPage: number,
    searchText?: string
  ): Promise<RequestResult<ApiFilterResult<Store>>>
  {
    return await YusrApiHelper.Post(
      `${ApiConstants.baseUrl}/${this.routeName}/FilterAll?pageNumber=${pageNumber}&rowsPerPage=${rowsPerPage}`,
      searchText
    );
  }
}
