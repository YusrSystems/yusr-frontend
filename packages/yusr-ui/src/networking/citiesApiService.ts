import type { City, FilterCondition } from "../entities";
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
    condition?: FilterCondition<City>
  ): Promise<RequestResult<FilterResult<City>>>
  {
    return await YusrApiHelper.Post(
      `${ApiConstants.baseUrl}/${this.routeName}/Filter?pageNumber=${pageNumber}&rowsPerPage=${rowsPerPage}`,
      condition
    );
  }
}
