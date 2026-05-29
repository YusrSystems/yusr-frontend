import type { Country } from "../entities";
import type { FilterResult, RequestResult } from "../types";
import { ApiConstants } from "./apiConstants";
import { BaseFilterableApiService } from "./baseFilterableApiService";
import { YusrApiHelper } from "./yusrApiHelper";

export class CountriesApiService extends BaseFilterableApiService<Country>
{
  routeName: string = "Countries";

  async Filter(
    pageNumber: number,
    rowsPerPage: number,
    searchText?: string
  ): Promise<RequestResult<FilterResult<Country>>>
  {
    return await YusrApiHelper.Post(
      `${ApiConstants.baseUrl}/${this.routeName}/Filter?pageNumber=${pageNumber}&rowsPerPage=${rowsPerPage}`,
      searchText
    );
  }
}
