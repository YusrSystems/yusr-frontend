import { FilterByTypeRequest } from "../entities";
import { Dto, Entity } from "../stateManager";
import type { ApiFilterResult } from "../types";
import type { FilterResult } from "../types/filterResult";
import { ApiConstants } from "./apiConstants";
import { YusrApiHelper } from "./yusrApiHelper";

export abstract class BaseFilterableApiService<TEntity extends Entity<TDto>, TDto extends Dto>
{
  abstract routeName: string;
  abstract createEntity(dto: TDto): TEntity;

  /**
   * Getting filttered data from backend
   *
   * @param {number} pageNumber
   * @param {number} rowsPerPage
   * @param {string} [searchText]
   * @param {number} [type] optional prop for data the has different types, like accounts
   * @return {*}  {Promise<FilterResult<TEntity, TDto>>}
   * @memberof BaseFilterableApiService
   */
  async Filter(
    pageNumber: number,
    rowsPerPage: number,
    searchText?: string,
    type?: FilterByTypeRequest
  ): Promise<FilterResult<TEntity, TDto>>
  {
    let rawResult;
    if (Boolean(type))
    {
      rawResult = await YusrApiHelper.Post<ApiFilterResult<TDto>>(
        `${ApiConstants.baseUrl}/${this.routeName}/FilterByTypes?pageNumber=${pageNumber}&rowsPerPage=${rowsPerPage}`,
        type
      );
    }
    else
    {
      rawResult = await YusrApiHelper.Post<ApiFilterResult<TDto>>(
        `${ApiConstants.baseUrl}/${this.routeName}/Filter?pageNumber=${pageNumber}&rowsPerPage=${rowsPerPage}`,
        searchText
      );
    }

    return {
      data: rawResult?.data?.data?.map((dto: TDto) => this.createEntity(dto)) ?? [],
      count: rawResult?.data?.count ?? 0
    };
  }
}
