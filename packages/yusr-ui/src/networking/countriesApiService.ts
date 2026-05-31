import type { Country } from "../entities";
import type { ApiFilterResult, RequestResult } from "../types";
import { ApiConstants } from "./apiConstants";
import { BaseFilterableApiServiceOld } from "./baseFilterableApiServiceOld";
import { YusrApiHelper } from "./yusrApiHelper";

export class CountriesApiService extends BaseFilterableApiServiceOld<Country>
{
  routeName: string = "Countries";

  async Filter(
    pageNumber: number,
    rowsPerPage: number,
    searchText?: string
  ): Promise<RequestResult<ApiFilterResult<Country>>>
  {
    return await YusrApiHelper.Post(
      `${ApiConstants.baseUrl}/${this.routeName}/Filter?pageNumber=${pageNumber}&rowsPerPage=${rowsPerPage}`,
      searchText
    );
  }
}
