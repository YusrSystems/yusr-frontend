import { type TFunction } from "i18next";
import { type ValidationRuleOld, Validators } from "../validation";
import { BaseEntity } from "./baseEntity";

export class Role extends BaseEntity
{
  public name!: string;
  public permissions!: string[];
  public authorizedStores!: number[];

  constructor(init?: Partial<Role>)
  {
    super();
    Object.assign(this, init);
  }
}

export class RoleValidationRules
{
  public static validationRules = (t: TFunction<"commonEntities", undefined>): ValidationRuleOld<Partial<Role>>[] => [{
    field: "name",
    selector: (d) => d.name,
    validators: [Validators.required(t("roles.nameRequired"))]
  }];
}
