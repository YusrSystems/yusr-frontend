import type { FilterResult } from "@yusr_systems/core";

export interface IEntityState<T>
{
  entities: FilterResult<T>;
  isLoaded: boolean;
  isLoading: boolean;
  currentPage: number;
  rowsPerPage: number;
  filterTypes?: number[];
}
