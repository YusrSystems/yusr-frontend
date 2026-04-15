import type { FilterResult } from "yusr-core";

export interface IEntityState<T>
{
  entities: FilterResult<T>;
  isLoaded: boolean;
  isLoading: boolean;
  currentPage: number;
  rowsPerPage: number;
  filterTypes?: number[];
}
