import type { Signal } from "@preact/signals-react";
import { type TFunction } from "i18next";
import { i18n } from "../locales";
import { ChangeableEntity, type ChangeableEntityMode, Dto } from "../stateManager";
import { type ValidationRuleOld, Validators } from "../validation";
import { BaseEntity } from "./baseEntity";

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
  public permissions!: string[];
}

export abstract class Role<TRoleDto extends RoleDto> extends ChangeableEntity<TRoleDto>
{
  public name: Signal<string>;
  public permissions: Signal<string[]>;

  constructor(
    dto: TRoleDto,
    mode: ChangeableEntityMode = "create"
  )
  {
    super(dto, [{
      field: "name",
      selector: (d) => d.name,
      validators: [Validators.required(i18n.t("commonEntities:roles.nameRequired"))]
    }], mode);

    this.name = this.assign("name", dto?.name ?? "");
    this.permissions = this.assign("permissions", dto?.permissions ?? []);
  }
}
