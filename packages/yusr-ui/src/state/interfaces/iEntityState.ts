import type { ApiFilterResult } from "../../types";

export interface IEntityState<T>
{
  entities: ApiFilterResult<T>;
  isLoaded: boolean;
  isLoading: boolean;
  currentPage: number;
  rowsPerPage: number;
  filterTypes?: number[];
}
