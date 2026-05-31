import type { Signal } from "@preact/signals";
import { type TFunction } from "i18next";
import { BaseEntity, createGenericDialogSlice, createGenericEntitySlice, createGenericFormSlice, Dto, Entity, type ValidationRule, Validators } from "yusr-ui";
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
  public static validationRules = (t: TFunction<"accounting">): ValidationRule<Partial<TaxOld>>[] => [{
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

export class Tax extends Entity<TaxDto>
{
  declare name: Signal<string>;
  declare percentage: Signal<string>;
  declare isPrimary: Signal<boolean>;
}
