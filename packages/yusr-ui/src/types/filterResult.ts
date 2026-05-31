import { Dto, Entity } from "../stateManager";

export type FilterResult<TEntity extends Entity<TDto>, TDto extends Dto> = {
  data: TEntity[] | undefined;
  count: number;
};
