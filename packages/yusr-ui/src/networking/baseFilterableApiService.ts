import type { BaseEntity, FilterCondition } from "../entities";
import type { FilterResult } from "../types/filterResult";
import type { RequestResult } from "../types/requestResult";
import { ApiConstants } from "./apiConstants";
import { YusrApiHelper } from "./yusrApiHelper";

export abstract class BaseFilterableApiService<T extends BaseEntity>
{
  abstract routeName: string;

  async Filter(
    pageNumber: number,
    rowsPerPage: number,
    condition?: FilterCondition<T>
  ): Promise<RequestResult<FilterResult<T>>>
  {
    return await YusrApiHelper.Post(
      `${ApiConstants.baseUrl}/${this.routeName}/Filter?pageNumber=${pageNumber}&rowsPerPage=${rowsPerPage}`,
      condition
    );
  }
}
