import type { FilterCondition } from "yusr-ui";

export class FilterByTypeRequest<T>
{
  public types: number[] = [];
  public condition?: FilterCondition<T>;

  constructor(init?: Partial<FilterByTypeRequest<T>>)
  {
    Object.assign(this, init);
  }
}
