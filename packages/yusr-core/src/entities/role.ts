import type { ColumnName } from "../types";
import { BaseEntity } from "./baseEntity";

export class Role extends BaseEntity
{
  public name!: string;
  public permissions!: string[];

  constructor(init?: Partial<Role>)
  {
    super();
    Object.assign(this, init);
  }
}

export class RoleFilterColumns
{
  public static columnsNames: ColumnName[] = [{ label: "اسم الدور", value: "Name" }];
}
