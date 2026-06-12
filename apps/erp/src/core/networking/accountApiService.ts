import { Account, type AccountDto } from "@/core/data/account";
import { ApiConstants, type ApiFilterResult, BaseApiService, FilterByTypeRequest, type FilterResult, YusrApiHelper } from "yusr-ui";

export default class AccountApiService extends BaseApiService<Account, AccountDto>
{
  routeName: string = "Accounts";

  override createEntity(dto: AccountDto): Account
  {
    return new Account(dto);
  }

  async FilterByTypes(
    pageNumber: number,
    rowsPerPage: number,
    request: FilterByTypeRequest
  ): Promise<FilterResult<Account, AccountDto>>
  {
    const res = await YusrApiHelper.Post<ApiFilterResult<AccountDto>>(
      `${ApiConstants.baseUrl}/${this.routeName}/FilterByTypes?pageNumber=${pageNumber}&rowsPerPage=${rowsPerPage}`,
      request
    );

    return {
      data: res?.data?.data?.map((dto: AccountDto) => this.createEntity(dto)) ?? [],
      count: res?.data?.count ?? 0
    };
  }
}
