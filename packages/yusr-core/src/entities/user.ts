import type { ColumnName } from "../types";
import { BaseEntity } from "./baseEntity";
import type { Branch } from "./branch";
import type { Role } from "./role";

export class User extends BaseEntity
{
  public username!: string;
  public password!: string;
  public isActive!: boolean;
  public branchId!: number;
  public roleId!: number;
  public branch!: Branch;
  public role!: Role;

  constructor(init?: Partial<User>)
  {
    super();
    Object.assign(this, init);
  }
}

export class UserFilterColumns
{
  public static columnsNames: ColumnName[] = [{ label: "رقم المستخدم", value: "Id" }, {
    label: "اسم المستخدم",
    value: "Username"
  }];
}
