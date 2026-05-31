import { Dto, Entity } from "../stateManager";
import type { ApiFilterResult } from "../types";
import type { FilterResult } from "../types/filterResult";
import type { RequestResult } from "../types/requestResult";
import { ApiConstants } from "./apiConstants";
import { YusrApiHelper } from "./yusrApiHelper";

export abstract class BaseFilterableApiService<TEntity extends Entity<TDto>, TDto extends Dto>
{
  abstract routeName: string;
  abstract createEntity(dto: TDto): TEntity;

  async Filter(
    pageNumber: number,
    rowsPerPage: number,
    searchText?: string
  ): Promise<RequestResult<FilterResult<TEntity, TDto>>>
  {
    const rawResult = await YusrApiHelper.Post<ApiFilterResult<TDto>>(
      `${ApiConstants.baseUrl}/${this.routeName}/Filter?pageNumber=${pageNumber}&rowsPerPage=${rowsPerPage}`,
      searchText
    );

    return {
      ...rawResult,
      data: rawResult.data
        ? {
          count: rawResult.data.count,
          data: rawResult.data.data?.map((dto: TDto) => this.createEntity(dto))
        }
        : undefined
    };
  }
}
