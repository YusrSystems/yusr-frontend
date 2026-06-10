import { type TFunction } from "i18next";
import { BaseEntity, createGenericDialogSlice, createGenericEntitySlice, createGenericFormSlice, type ValidationRuleOld, Validators } from "yusr-ui";
import PricingMethodsApiServiceOld from "../networking/ppricingMethodsApiServiceOld";

export default class PricingMethodOld extends BaseEntity
{
  public name!: string;

  constructor(init?: Partial<PricingMethodOld>)
  {
    super();
    Object.assign(this, init);
  }
}

export class PricingMethodValidationRules
{
  public static validationRules = (t: TFunction<"stocking">): ValidationRuleOld<Partial<PricingMethodOld>>[] => [{
    field: "name",
    selector: (d) => d.name,
    validators: [Validators.required(t("pricingMethods.nameRequired"))]
  }];
}

export class PricingMethodSlice
{
  private static entitySliceInstance = createGenericEntitySlice("pricingMethod", new PricingMethodsApiServiceOld());
  public static entityActions = PricingMethodSlice.entitySliceInstance.actions;
  public static entityReducer = PricingMethodSlice.entitySliceInstance.reducer;

  private static dialogSliceInstance = createGenericDialogSlice<PricingMethodOld>("pricingMethodDialog");
  public static dialogActions = PricingMethodSlice.dialogSliceInstance.actions;
  public static dialogReducer = PricingMethodSlice.dialogSliceInstance.reducer;

  private static formSliceInstance = createGenericFormSlice<PricingMethodOld>("pricingMethodForm");
  public static formActions = PricingMethodSlice.formSliceInstance.actions;
  public static formReducer = PricingMethodSlice.formSliceInstance.reducer;
}
