import { ApiConstants, type ApiFilterResult, BaseApiServiceOld, type RequestResult, YusrApiHelper } from "yusr-ui";
import type StoreOld from "../data/store";

export default class StoresApiServiceOld extends BaseApiServiceOld<StoreOld>
{
  routeName: string = "Stores";

  async FilterAll(
    pageNumber: number,
    rowsPerPage: number,
    searchText?: string
  ): Promise<RequestResult<ApiFilterResult<StoreOld>>>
  {
    return await YusrApiHelper.Post(
      `${ApiConstants.baseUrl}/${this.routeName}/FilterAll?pageNumber=${pageNumber}&rowsPerPage=${rowsPerPage}`,
      searchText
    );
  }
}
