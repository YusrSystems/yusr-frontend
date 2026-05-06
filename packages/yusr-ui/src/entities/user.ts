import { type TFunction } from "i18next";
import { UsersApiService } from "../networking";
import { createGenericDialogSlice, createGenericEntitySlice, createGenericFormSlice } from "../state";
import type { ColumnName } from "../types";
import { type ValidationRule, Validators } from "../validation";
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
  public static columnsNames: ColumnName<User>[] = [{
    label: "اسم المستخدم",
    value: "username"
  }];
}

export class UserValidationRules
{
  public static validationRules = (t: TFunction<"commonEntities", undefined>): ValidationRule<Partial<User>>[] => [{
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

export class UserSlice
{
  private static entitySliceInstance = createGenericEntitySlice("user", new UsersApiService());
  public static entityActions = UserSlice.entitySliceInstance.actions;
  public static entityReducer = UserSlice.entitySliceInstance.reducer;

  private static dialogSliceInstance = createGenericDialogSlice<User>("userDialog");
  public static dialogActions = UserSlice.dialogSliceInstance.actions;
  public static dialogReducer = UserSlice.dialogSliceInstance.reducer;

  private static formSliceInstance = createGenericFormSlice<User>("userForm");
  public static formActions = UserSlice.formSliceInstance.actions;
  public static formReducer = UserSlice.formSliceInstance.reducer;
}
