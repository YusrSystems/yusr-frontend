import type { Currency } from "../entities/currency";
import type { ApiFilterResult, RequestResult } from "../types";
import { ApiConstants } from "./apiConstants";
import { BaseFilterableApiServiceOld } from "./baseFilterableApiServiceOld";
import { YusrApiHelper } from "./yusrApiHelper";

export class CurrenciesApiService extends BaseFilterableApiServiceOld<Currency>
{
  routeName: string = "Currencies";

  async Filter(
    pageNumber: number,
    rowsPerPage: number,
    searchText?: string
  ): Promise<RequestResult<ApiFilterResult<Currency>>>
  {
    return await YusrApiHelper.Post(
      `${ApiConstants.baseUrl}/${this.routeName}/Filter?pageNumber=${pageNumber}&rowsPerPage=${rowsPerPage}`,
      searchText
    );
  }
}
