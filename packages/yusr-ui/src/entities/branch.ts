import { type TFunction } from "i18next";
import { type ValidationRuleOld, Validators } from "../validation";
import { BaseEntity } from "./baseEntity";
import type { CityOld } from "./city";

export class Branch extends BaseEntity
{
  public name!: string;
  public cityId!: number;
  public city!: CityOld;
  public street!: string;
  public district!: string;
  public buildingNumber!: string;
  public postalCode!: string;

  constructor(init?: Partial<Branch>)
  {
    super();
    Object.assign(this, init);
  }
}

export class BranchValidationRules
{
  public static validationRules = (
    t: TFunction<"commonEntities", undefined>
  ): ValidationRuleOld<Partial<Branch>>[] => [{
    field: "name",
    selector: (d) => d.name,
    validators: [Validators.required(t("branches.nameRequired"))]
  }, {
    field: "cityId",
    selector: (d) => d.cityId,
    validators: [Validators.required(t("branches.cityRequired"))]
  }, {
    field: "buildingNumber",
    selector: (d) => d.buildingNumber,
    validators: [Validators.optional(
      Validators.exactLength(4, t("branches.buildingNumberLength")),
      Validators.numeric(t("branches.buildingNumberNumeric"))
    )]
  }, {
    field: "postalCode",
    selector: (d) => d.postalCode,
    validators: [Validators.optional(
      Validators.exactLength(5, t("branches.postalCodeLength")),
      Validators.numeric(t("branches.postalCodeNumeric"))
    )]
  }];
}
