import { ApiConstants, BaseApiService, FilterByTypeRequest, type FilterResult, type RequestResult, YusrApiHelper } from "yusr-ui";
import type Account from "../data/account";

export default class AccountsApiService extends BaseApiService<Account>
{
  routeName: string = "Accounts";

  async FilterByTypes(
    pageNumber: number,
    rowsPerPage: number,
    request: FilterByTypeRequest<Account>
  ): Promise<RequestResult<FilterResult<Account>>>
  {
    return await YusrApiHelper.Post(
      `${ApiConstants.baseUrl}/${this.routeName}/FilterByTypes?pageNumber=${pageNumber}&rowsPerPage=${rowsPerPage}`,
      request
    );
  }
}
