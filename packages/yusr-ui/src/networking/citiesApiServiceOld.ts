import type { CityOld } from "../entities/city";
import type { ApiFilterResult, RequestResult } from "../types";
import { ApiConstants } from "./apiConstants";
import { BaseFilterableApiServiceOld } from "./baseFilterableApiServiceOld";
import { YusrApiHelper } from "./yusrApiHelper";

export class CitiesApiServiceOld extends BaseFilterableApiServiceOld<CityOld>
{
  routeName: string = "Cities";

  async Filter(
    pageNumber: number,
    rowsPerPage: number,
    searchText?: string
  ): Promise<RequestResult<ApiFilterResult<CityOld>>>
  {
    return await YusrApiHelper.Post(
      `${ApiConstants.baseUrl}/${this.routeName}/Filter?pageNumber=${pageNumber}&rowsPerPage=${rowsPerPage}`,
      searchText
    );
  }
}
