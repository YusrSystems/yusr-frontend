import type { Signal } from "@preact/signals-react";
import { i18n } from "../locales";
import { ChangeableEntity, type ChangeableEntityMode, Dto } from "../stateManager";
import { type ValidationRule, Validators } from "../validation";
import { RoleDto } from "./role";

export class UserDto extends Dto
{
  public username!: string;
  public password!: string;
  public isActive!: boolean;
  public branchId!: number | undefined;
  public branchName!: string;
  public roleId!: number | undefined;
  public roleName!: string;
  public role!: RoleDto;
}

export class User extends ChangeableEntity<UserDto>
{
  declare username: Signal<string>;
  declare password: Signal<string>;
  declare isActive: Signal<boolean>;
  declare branchId: Signal<number>;
  declare branchName: Signal<string>;
  declare roleId: Signal<number>;
  declare roleName: Signal<string>;
  declare role: Signal<RoleDto>;

  constructor(dto: Partial<UserDto>, mode: ChangeableEntityMode = "create")
  {
    const rules: ValidationRule<Partial<UserDto>>[] = [{
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
    }];

    super(
      {
        id: 0,
        username: "",
        password: "",
        isActive: true,
        branchId: undefined,
        branchName: "",
        roleId: undefined,
        roleName: "",
        role: new RoleDto(),
        ...dto
      },
      rules,
      mode
    );
  }
}
