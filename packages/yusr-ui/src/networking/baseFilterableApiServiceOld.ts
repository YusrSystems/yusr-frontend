import type { BaseEntity } from "../entities";
import type { ApiFilterResult } from "../types/apiFilterResult";
import type { RequestResult } from "../types/requestResult";
import { ApiConstants } from "./apiConstants";
import { YusrApiHelper } from "./yusrApiHelper";

export abstract class BaseFilterableApiServiceOld<T extends BaseEntity>
{
  abstract routeName: string;

  async Filter(
    pageNumber: number,
    rowsPerPage: number,
    searchText?: string
  ): Promise<RequestResult<ApiFilterResult<T>>>
  {
    return await YusrApiHelper.Post(
      `${ApiConstants.baseUrl}/${this.routeName}/Filter?pageNumber=${pageNumber}&rowsPerPage=${rowsPerPage}`,
      searchText
    );
  }
}
