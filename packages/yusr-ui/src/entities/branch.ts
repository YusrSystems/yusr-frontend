import type { Signal } from "@preact/signals-react";
import { type TFunction } from "i18next";
import { i18n } from "../locales";
import { ChangeableEntity, type ChangeableEntityMode, Dto } from "../stateManager";
import { type ValidationRule, type ValidationRuleOld, Validators } from "../validation";
import { BaseEntity } from "./baseEntity";
import type { CityOld } from "./city";

export class BranchOld extends BaseEntity
{
  public name!: string;
  public cityId!: number;
  public city!: CityOld;
  public street!: string;
  public district!: string;
  public buildingNumber!: string;
  public postalCode!: string;

  constructor(init?: Partial<BranchOld>)
  {
    super();
    Object.assign(this, init);
  }
}

export class BranchValidationRules
{
  public static validationRules = (
    t: TFunction<"commonEntities", undefined>
  ): ValidationRuleOld<Partial<BranchOld>>[] => [{
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

export class BranchDto extends Dto
{
  public name!: string;
  public cityId!: number | undefined;
  public cityName!: number | undefined;
  public street?: string;
  public district?: string;
  public buildingNumber?: string;
  public postalCode?: string;
}

export class Branch extends ChangeableEntity<BranchDto>
{
  declare name: Signal<string>;
  declare cityId: Signal<number | undefined>;
  declare cityName: Signal<string | undefined>;
  declare street: Signal<string | undefined>;
  declare district: Signal<string | undefined>;
  declare buildingNumber: Signal<string | undefined>;
  declare postalCode: Signal<string | undefined>;

  constructor(dto: Partial<BranchDto>, mode: ChangeableEntityMode = "create")
  {
    const rules: ValidationRule<Partial<BranchDto>>[] = [{
      field: "name",
      selector: (d) => d.name,
      validators: [Validators.required(i18n.t("commonEntities:branches.nameRequired"))]
    }, {
      field: "cityId",
      selector: (d) => d.cityId,
      validators: [Validators.required(i18n.t("commonEntities:branches.cityRequired"))]
    }, {
      field: "buildingNumber",
      selector: (d) => d.buildingNumber,
      validators: [Validators.optional(
        Validators.exactLength(4, i18n.t("commonEntities:branches.buildingNumberLength")),
        Validators.numeric(i18n.t("commonEntities:branches.buildingNumberNumeric"))
      )]
    }, {
      field: "postalCode",
      selector: (d) => d.postalCode,
      validators: [Validators.optional(
        Validators.exactLength(5, i18n.t("commonEntities:branches.postalCodeLength")),
        Validators.numeric(i18n.t("commonEntities:branches.postalCodeNumeric"))
      )]
    }];

    super(
      {
        id: 0,
        name: "",
        cityId: undefined,
        cityName: undefined,
        street: undefined,
        district: undefined,
        buildingNumber: undefined,
        postalCode: undefined,
        ...dto
      },
      rules,
      mode
    );
  }
}
