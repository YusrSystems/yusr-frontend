import { ApiConstants, type ApiFilterResult, BaseApiServiceOld, FilterByTypeRequest, type RequestResult, YusrApiHelper } from "yusr-ui";
import type AccountOld from "../data/accountOld";

export default class AccountsApiServiceOld extends BaseApiServiceOld<AccountOld>
{
  routeName: string = "Accounts";

  async FilterByTypes(
    pageNumber: number,
    rowsPerPage: number,
    request: FilterByTypeRequest
  ): Promise<RequestResult<ApiFilterResult<AccountOld>>>
  {
    return await YusrApiHelper.Post(
      `${ApiConstants.baseUrl}/${this.routeName}/FilterByTypes?pageNumber=${pageNumber}&rowsPerPage=${rowsPerPage}`,
      request
    );
  }
}
