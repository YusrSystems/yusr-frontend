import type { Signal } from "@preact/signals-react";
import { type TFunction } from "i18next";
import { BaseEntity, ChangeableEntity, type ChangeableEntityMode, createGenericDialogSlice, createGenericEntitySlice, createGenericFormSlice, Dto, i18n, type ValidationRule, type ValidationRuleOld, Validators } from "yusr-ui";
import TaxesApiServiceOld from "../networking/taxesApiServiceold";

export class TaxOld extends BaseEntity
{
  public name!: string;
  public percentage!: number;
  public isPrimary!: boolean;

  constructor(init?: Partial<TaxOld>)
  {
    super();
    Object.assign(this, init);
  }
}

export class TaxValidationRules
{
  public static validationRules = (t: TFunction<"accounting">): ValidationRuleOld<Partial<TaxOld>>[] => [{
    field: "name",
    selector: (d) => d.name,
    validators: [Validators.required(t("taxes.nameRequired"))]
  }, {
    field: "percentage",
    selector: (d) => d.percentage,
    validators: [
      Validators.required(t("taxes.percentageRequired")),
      Validators.min(0, t("taxes.percentageMin")),
      Validators.max(100, t("taxes.percentageMax"))
    ]
  }];
}

export class TaxSlice
{
  private static entitySliceInstance = createGenericEntitySlice("tax", new TaxesApiServiceOld());
  public static entityActions = TaxSlice.entitySliceInstance.actions;
  public static entityReducer = TaxSlice.entitySliceInstance.reducer;

  private static dialogSliceInstance = createGenericDialogSlice<TaxOld>("taxDialog");
  public static dialogActions = TaxSlice.dialogSliceInstance.actions;
  public static dialogReducer = TaxSlice.dialogSliceInstance.reducer;

  private static formSliceInstance = createGenericFormSlice<TaxOld>("taxForm");
  public static formActions = TaxSlice.formSliceInstance.actions;
  public static formReducer = TaxSlice.formSliceInstance.reducer;
}

export class TaxDto extends Dto
{
  public name!: string;
  public percentage!: number;
  public isPrimary!: boolean;
}

export class Tax extends ChangeableEntity<TaxDto>
{
  public name: Signal<string>;
  public percentage: Signal<number>;
  public isPrimary: Signal<boolean>;

  constructor(dto?: Partial<TaxDto> | undefined, mode: ChangeableEntityMode = "create")
  {
    const rules: ValidationRule<Partial<TaxDto>>[] = [{
      field: "name",
      selector: (d) => d.name,
      validators: [Validators.required(i18n.t("accounting:taxes.nameRequired"))]
    }, {
      field: "percentage",
      selector: (d) => d.percentage,
      validators: [
        Validators.required(i18n.t("accounting:taxes.percentageRequired")),
        Validators.min(1, i18n.t("accounting:taxes.percentageMin")),
        Validators.max(100, i18n.t("accounting:taxes.percentageMax"))
      ]
    }];

    super(dto, rules, mode);

    this.name = this.assign("name", dto?.name ?? "");
    this.percentage = this.assign("percentage", dto?.percentage ?? 0);
    this.isPrimary = this.assign("isPrimary", dto?.isPrimary ?? true);
  }
}
