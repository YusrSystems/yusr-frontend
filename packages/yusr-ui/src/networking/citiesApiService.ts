import type { City } from "../entities";
import type { FilterResult, RequestResult } from "../types";
import { ApiConstants } from "./apiConstants";
import { BaseFilterableApiService } from "./baseFilterableApiService";
import { YusrApiHelper } from "./yusrApiHelper";

export class CitiesApiService extends BaseFilterableApiService<City>
{
  routeName: string = "Cities";

  async Filter(
    pageNumber: number,
    rowsPerPage: number,
    searchText?: string
  ): Promise<RequestResult<FilterResult<City>>>
  {
    return await YusrApiHelper.Post(
      `${ApiConstants.baseUrl}/${this.routeName}/Filter?pageNumber=${pageNumber}&rowsPerPage=${rowsPerPage}`,
      searchText
    );
  }
}
