import type { City } from "../entities";
import type { ApiFilterResult, RequestResult } from "../types";
import { ApiConstants } from "./apiConstants";
import { BaseFilterableApiServiceOld } from "./baseFilterableApiServiceOld";
import { YusrApiHelper } from "./yusrApiHelper";

export class CitiesApiService extends BaseFilterableApiServiceOld<City>
{
  routeName: string = "Cities";

  async Filter(
    pageNumber: number,
    rowsPerPage: number,
    searchText?: string
  ): Promise<RequestResult<ApiFilterResult<City>>>
  {
    return await YusrApiHelper.Post(
      `${ApiConstants.baseUrl}/${this.routeName}/Filter?pageNumber=${pageNumber}&rowsPerPage=${rowsPerPage}`,
      searchText
    );
  }
}
