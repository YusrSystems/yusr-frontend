import type { ColumnName } from "../types/ColumnName";
import { BaseEntity } from "./baseEntity";

export class Country extends BaseEntity
{
  public name!: string;
  public code!: string;

  constructor(init?: Partial<Country>)
  {
    super();
    Object.assign(this, init);
  }
}

export class CountryFilterColumns
{
  public static columnsNames: ColumnName<Country>[] = [{ label: "اسم الدولة", value: "name" }];
}
