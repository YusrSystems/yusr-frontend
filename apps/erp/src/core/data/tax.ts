import { type TFunction } from "i18next";
import { BaseEntity, type ColumnName, type ValidationRule, Validators } from "yusr-ui";
import { createGenericDialogSlice, createGenericEntitySlice, createGenericFormSlice } from "yusr-ui";
import TaxesApiService from "../networking/taxesApiService";

export class Tax extends BaseEntity
{
  public name!: string;
  public percentage!: number;
  public isPrimary!: boolean;

  constructor(init?: Partial<Tax>)
  {
    super();
    Object.assign(this, init);
  }
}

export class TaxFilterColumns
{
  public static columnsNames = (t: TFunction<"accounting">): ColumnName<Tax>[] => [
    { label: t("taxes.taxName"), value: "name" }
  ];
}

export class TaxValidationRules
{
  public static validationRules = (t: TFunction<"accounting">): ValidationRule<Partial<Tax>>[] => [{
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
  private static entitySliceInstance = createGenericEntitySlice("tax", new TaxesApiService());
  public static entityActions = TaxSlice.entitySliceInstance.actions;
  public static entityReducer = TaxSlice.entitySliceInstance.reducer;

  private static dialogSliceInstance = createGenericDialogSlice<Tax>("taxDialog");
  public static dialogActions = TaxSlice.dialogSliceInstance.actions;
  public static dialogReducer = TaxSlice.dialogSliceInstance.reducer;

  private static formSliceInstance = createGenericFormSlice<Tax>("taxForm");
  public static formActions = TaxSlice.formSliceInstance.actions;
  public static formReducer = TaxSlice.formSliceInstance.reducer;
}