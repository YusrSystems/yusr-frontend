import type { Signal } from "@preact/signals-react";
import { i18n } from "../locales";
import { Dto, ValidatableEntity } from "../stateManager";
import { Validators } from "../validation";
import type { Branch } from "./branch";
import type { Role } from "./role";

export class UserDto extends Dto
{
  public username!: string;
  public password!: string;
  public isActive!: boolean;
  public branchId!: number;
  public roleId!: number;
  public branch!: Branch;
  public role!: Role;
}

export class User extends ValidatableEntity<UserDto>
{
  declare username: Signal<string>;
  declare password: Signal<string>;
  declare isActive: Signal<boolean>;
  declare branchId: Signal<number>;
  declare roleId: Signal<number>;
  declare branch: Signal<Branch>;
  declare role: Signal<Role>;

  constructor(dto: Partial<UserDto>)
  {
    super(dto, [{
      field: "username",
      selector: (d) => d.username,
      validators: [Validators.required(i18n.t("commonEntities:users.usernameRequired"))]
    }, {
      field: "password",
      selector: (d) => d.password,
      validators: [Validators.required(i18n.t("commonEntities:users.passwordRequired"))]
    }, {
      field: "roleId",
      selector: (d) => d.roleId,
      validators: [Validators.required(i18n.t("commonEntities:users.roleRequired"))]
    }, {
      field: "branchId",
      selector: (d) => d.branchId,
      validators: [Validators.required(i18n.t("commonEntities:users.branchRequired"))]
    }]);
  }
}
