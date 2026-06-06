import { ChangeableEntity, type ChangeableEntityMode, Dto } from "../stateManager";
import { type TFunction } from "i18next";
import { type ValidationRule, type ValidationRuleOld, Validators } from "../validation";
import { BaseEntity } from "./baseEntity";
import { i18n } from "../locales";
import type { Signal } from "@preact/signals-react";

export class RoleOld extends BaseEntity
{
  public name!: string;
  public permissions!: string[];
  public authorizedStores!: number[];

  constructor(init?: Partial<RoleOld>)
  {
    super();
    Object.assign(this, init);
  }
}

export class RoleValidationRules
{
  public static validationRules = (
    t: TFunction<"commonEntities", undefined>
  ): ValidationRuleOld<Partial<RoleOld>>[] => [{
    field: "name",
    selector: (d) => d.name,
    validators: [Validators.required(t("roles.nameRequired"))]
  }];
}

export class RoleDto extends Dto
{
  public name!: string;
  public percentage!: number;
  public isPrimary!: boolean;
}

export class Role extends ChangeableEntity<RoleDto>
{
  declare name: Signal<string>;
  declare permissions: Signal<string[]>;
  declare authorizedStores: Signal<number[]>;

  constructor(dto: Partial<RoleDto>, mode: ChangeableEntityMode = "create")
  {
    const rules: ValidationRule<Partial<RoleDto>>[] = [{
    field: "name",
    selector: (d) => d.name,
    validators: [Validators.required(i18n.t("commonEntities:roles.nameRequired"))]
  }];

    super(dto, rules, mode);
  }
}
