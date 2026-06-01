import { type Signal, signal } from "@preact/signals-react";
import { Dto, Entity } from "../stateManager";
import type { ApiFilterResult } from "../types";
import { ApiConstants } from "./apiConstants";
import { YusrApiHelper } from "./yusrApiHelper";

export abstract class BaseFilterableApiService<TEntity extends Entity<TDto>, TDto extends Dto>
{
  public Data: Signal<TEntity[]> = signal([]);
  public Count: Signal<number> = signal(0);
  abstract routeName: string;
  abstract createEntity(dto: TDto): TEntity;

  async Filter(
    pageNumber: number,
    rowsPerPage: number,
    searchText?: string
  ): Promise<void>
  {
    const rawResult = await YusrApiHelper.Post<ApiFilterResult<TDto>>(
      `${ApiConstants.baseUrl}/${this.routeName}/Filter?pageNumber=${pageNumber}&rowsPerPage=${rowsPerPage}`,
      searchText
    );

    this.Data.value = rawResult?.data?.data?.map((dto: TDto) => this.createEntity(dto)) ?? [];
    this.Count.value = rawResult?.data?.count ?? 0;
  }
}
