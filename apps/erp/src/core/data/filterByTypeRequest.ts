import type { FilterCondition } from "yusr-core";

export class FilterByTypeRequest
{
  public types: number[] = [];
  public condition?: FilterCondition;

  constructor(init?: Partial<FilterByTypeRequest>)
  {
    Object.assign(this, init);
  }
}
