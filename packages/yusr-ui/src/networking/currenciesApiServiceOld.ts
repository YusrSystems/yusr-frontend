import type { CurrencyOld } from "../entities/currency";
import type { ApiFilterResult, RequestResult } from "../types";
import { ApiConstants } from "./apiConstants";
import { BaseFilterableApiServiceOld } from "./baseFilterableApiServiceOld";
import { YusrApiHelper } from "./yusrApiHelper";

export class CurrenciesApiServiceOld extends BaseFilterableApiServiceOld<CurrencyOld>
{
  routeName: string = "Currencies";

  async Filter(
    pageNumber: number,
    rowsPerPage: number,
    searchText?: string
  ): Promise<RequestResult<ApiFilterResult<CurrencyOld>>>
  {
    return await YusrApiHelper.Post(
      `${ApiConstants.baseUrl}/${this.routeName}/Filter?pageNumber=${pageNumber}&rowsPerPage=${rowsPerPage}`,
      searchText
    );
  }
}
