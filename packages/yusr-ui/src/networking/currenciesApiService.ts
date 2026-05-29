import type { Currency } from "../entities";
import type { FilterResult, RequestResult } from "../types";
import { ApiConstants } from "./apiConstants";
import { BaseFilterableApiService } from "./baseFilterableApiService";
import { YusrApiHelper } from "./yusrApiHelper";

export class CurrenciesApiService extends BaseFilterableApiService<Currency>
{
  routeName: string = "Currencies";

  async Filter(
    pageNumber: number,
    rowsPerPage: number,
    searchText?: string
  ): Promise<RequestResult<FilterResult<Currency>>>
  {
    return await YusrApiHelper.Post(
      `${ApiConstants.baseUrl}/${this.routeName}/Filter?pageNumber=${pageNumber}&rowsPerPage=${rowsPerPage}`,
      searchText
    );
  }
}
