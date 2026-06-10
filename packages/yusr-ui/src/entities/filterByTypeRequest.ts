export class FilterByTypeRequest
{
  public types: number[] = [];
  public searchText?: string;

  constructor(init?: Partial<FilterByTypeRequest>)
  {
    Object.assign(this, init);
  }
}
