export class FilterByTypeRequest<T>
{
  public types: number[] = [];
  public searchText?: string;

  constructor(init?: Partial<FilterByTypeRequest<T>>)
  {
    Object.assign(this, init);
  }
}
