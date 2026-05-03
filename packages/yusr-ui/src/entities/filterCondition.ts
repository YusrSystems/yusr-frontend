export class FilterCondition<T>
{
  value!: string;
  columnName!: keyof T;

  constructor(init?: Partial<FilterCondition<T>>)
  {
    Object.assign(this, init);
  }
}
