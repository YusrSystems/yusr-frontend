import { type TFunction } from "i18next";
import { type ValidationRuleOld, Validators } from "../validation";
import { BaseEntity } from "./baseEntity";
import type { Branch } from "./branch";
import type { Role } from "./role";

export class UserOld extends BaseEntity
{
  public username!: string;
  public password!: string;
  public isActive!: boolean;
  public branchId!: number;
  public roleId!: number;
  public branch!: Branch;
  public role!: Role;

  constructor(init?: Partial<UserOld>)
  {
    super();
    Object.assign(this, init);
  }
}

export class UserValidationRules
{
  public static validationRules = (
    t: TFunction<"commonEntities", undefined>
  ): ValidationRuleOld<Partial<UserOld>>[] => [{
    field: "username",
    selector: (d) => d.username,
    validators: [Validators.required(t("users.usernameRequired"))]
  }, {
    field: "password",
    selector: (d) => d.password,
    validators: [Validators.required(t("users.passwordRequired"))]
  }, {
    field: "roleId",
    selector: (d) => d.roleId,
    validators: [Validators.required(t("users.roleRequired"))]
  }, {
    field: "branchId",
    selector: (d) => d.branchId,
    validators: [Validators.required(t("users.branchRequired"))]
  }];
}
