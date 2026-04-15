import type { ColumnName } from "../types";
import { BaseEntity } from "./baseEntity";
import type { City } from "./city";

export class Branch extends BaseEntity
{
  public name!: string;
  public cityId!: number;
  public city!: City;
  public street!: string;
  public district!: string;
  public buildingNumber!: string;
  public postalCode!: string;

  constructor(init?: Partial<Branch>)
  {
    super();
    Object.assign(this, init);
  }
}

export class BranchFilterColumns
{
  public static columnsNames: ColumnName[] = [{ label: "اسم الفرع", value: "Name" }, {
    label: "رقم الفرع",
    value: "Id"
  }];
}
