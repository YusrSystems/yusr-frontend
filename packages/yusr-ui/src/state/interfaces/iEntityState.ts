import type { FilterResult } from "../../types";

export interface IEntityState<T>
{
  entities: FilterResult<T>;
  isLoaded: boolean;
  isLoading: boolean;
  currentPage: number;
  rowsPerPage: number;
  filterTypes?: number[];
}
