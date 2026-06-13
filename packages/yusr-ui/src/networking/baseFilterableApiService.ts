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
   * Gets filtered data from the backend.
   *
   * @param {number} pageNumber
   * @param {number} rowsPerPage
   * @param {string} [searchText]
   * @param {number[]} [types] - When provided, filters by entity types (e.g. account types). Sends a {@link FilterByTypeRequest} body; otherwise sends plain searchText.
   * @param {Record<string, string | number>} [queryParams] - Additional query string parameters appended to the URL (e.g. `{ store: 1 }`).
   * @return {Promise<FilterResult<TEntity, TDto>>}
   * @memberof BaseFilterableApiService
   */
  async Filter(
    pageNumber: number,
    rowsPerPage: number,
    searchText?: string,
    types?: number[],
    queryParams?: Record<string, string | number>
  ): Promise<FilterResult<TEntity, TDto>>
  {
    const extraQuery = queryParams
      ? "&" + new URLSearchParams(
        Object.entries(queryParams).map(([k, v]) => [k, String(v)])
      ).toString()
      : "";

    const body = types !== undefined
      ? new FilterByTypeRequest({ searchText, types })
      : searchText;

    const containTypes = types !== undefined && types.length > 0;
    const rawResult = await YusrApiHelper.Post<ApiFilterResult<TDto>>(
      `${ApiConstants.baseUrl}/${this.routeName}/Filter${
        containTypes ? "ByTypes" : ""
      }?pageNumber=${pageNumber}&rowsPerPage=${rowsPerPage}${extraQuery}`,
      body
    );

    return {
      data: rawResult?.data?.data?.map((dto: TDto) => this.createEntity(dto)) ?? [],
      count: rawResult?.data?.count ?? 0
    };
  }
}
