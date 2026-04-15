import { BaseEntity, Branch, Role } from "yusr-core";



export default class User extends BaseEntity {
  public username!: string;
  public password!: string;
  public isActive!: boolean;
  public branchId!: number;
  public roleId!: number;
  public branch!: Branch;
  public role!: Role;

  constructor(init?: Partial<User>) {
    super();
    Object.assign(this, init);
  }
}
