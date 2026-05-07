import { type TFunction } from "i18next";
import { BaseEntity, type ColumnName, createGenericDialogSlice, createGenericEntitySlice, createGenericFormSlice, type ValidationRule, Validators } from "yusr-ui";
import PricingMethodsApiService from "../networking/PricingMethodsApiService";

export default class PricingMethod extends BaseEntity
{
  public name!: string;

  constructor(init?: Partial<PricingMethod>)
  {
    super();
    Object.assign(this, init);
  }
}

export class PricingMethodFilterColumns
{
  public static columnsNames = (t: TFunction<"accounting">): ColumnName<PricingMethod>[] => [{
    label: t("pricingMethods.methodName"),
    value: "name"
  }];
}

export class PricingMethodValidationRules
{
  public static validationRules = (t: TFunction<"accounting">): ValidationRule<Partial<PricingMethod>>[] => [{
    field: "name",
    selector: (d) => d.name,
    validators: [Validators.required(t("pricingMethods.nameRequired"))]
  }];
}

export class PricingMethodSlice
{
  private static entitySliceInstance = createGenericEntitySlice("pricingMethod", new PricingMethodsApiService());
  public static entityActions = PricingMethodSlice.entitySliceInstance.actions;
  public static entityReducer = PricingMethodSlice.entitySliceInstance.reducer;

  private static dialogSliceInstance = createGenericDialogSlice<PricingMethod>("pricingMethodDialog");
  public static dialogActions = PricingMethodSlice.dialogSliceInstance.actions;
  public static dialogReducer = PricingMethodSlice.dialogSliceInstance.reducer;

  private static formSliceInstance = createGenericFormSlice<PricingMethod>("pricingMethodForm");
  public static formActions = PricingMethodSlice.formSliceInstance.actions;
  public static formReducer = PricingMethodSlice.formSliceInstance.reducer;
}
