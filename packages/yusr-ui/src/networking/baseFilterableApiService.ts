import { Dto, Entity, type EntityMode } from "../stateManager";
import type { ApiFilterResult } from "../types";
import type { FilterResult } from "../types/filterResult";
import { ApiConstants } from "./apiConstants";
import { YusrApiHelper } from "./yusrApiHelper";

export abstract class BaseFilterableApiService<TEntity extends Entity<TDto>, TDto extends Dto>
{
  abstract routeName: string;
  abstract createEntity(dto: TDto, mode: EntityMode): TEntity;

  async Filter(
    pageNumber: number,
    rowsPerPage: number,
    searchText?: string
  ): Promise<FilterResult<TEntity, TDto>>
  {
    const rawResult = await YusrApiHelper.Post<ApiFilterResult<TDto>>(
      `${ApiConstants.baseUrl}/${this.routeName}/Filter?pageNumber=${pageNumber}&rowsPerPage=${rowsPerPage}`,
      searchText
    );

    return {
      data: rawResult?.data?.data?.map((dto: TDto) => this.createEntity(dto, "update")) ?? [],
      count: rawResult?.data?.count ?? 0
    };
  }
}
