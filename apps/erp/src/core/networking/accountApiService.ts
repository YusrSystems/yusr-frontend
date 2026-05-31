import { ApiConstants, type ApiFilterResult, BaseApiServiceOld, FilterByTypeRequest, type RequestResult, YusrApiHelper } from "yusr-ui";
import type Account from "../data/account";

export default class AccountsApiService extends BaseApiServiceOld<Account>
{
  routeName: string = "Accounts";

  async FilterByTypes(
    pageNumber: number,
    rowsPerPage: number,
    request: FilterByTypeRequest<Account>
  ): Promise<RequestResult<ApiFilterResult<Account>>>
  {
    return await YusrApiHelper.Post(
      `${ApiConstants.baseUrl}/${this.routeName}/FilterByTypes?pageNumber=${pageNumber}&rowsPerPage=${rowsPerPage}`,
      request
    );
  }
}
