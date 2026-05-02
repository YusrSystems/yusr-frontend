import type { FilterCondition } from "yusr-core";

export class FilterByTypeRequest<T>
{
  public types: number[] = [];
  public condition?: FilterCondition<T>;

  constructor(init?: Partial<FilterByTypeRequest<T>>)
  {
    Object.assign(this, init);
  }
}
