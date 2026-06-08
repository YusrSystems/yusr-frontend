import { ApiConstants, type ApiFilterResult, BaseApiService, type FilterResult, YusrApiHelper } from "yusr-ui";
import { Store, type StoreDto } from "../data/store";

export class StoresApiService extends BaseApiService<Store, StoreDto>
{
  routeName: string = "Stores";
  override createEntity(dto: StoreDto): Store
  {
    return new Store(dto);
  }

  async FilterAll(
    pageNumber: number,
    rowsPerPage: number,
    searchText?: string
  ): Promise<FilterResult<Store, StoreDto>>
  {
    const rawResult = await YusrApiHelper.Post<ApiFilterResult<StoreDto>>(
      `${ApiConstants.baseUrl}/${this.routeName}/FilterAll?pageNumber=${pageNumber}&rowsPerPage=${rowsPerPage}`,
      searchText
    );

    return {
      data: rawResult?.data?.data?.map((dto: StoreDto) => this.createEntity(dto)) ?? [],
      count: rawResult?.data?.count ?? 0
    };
  }
}
