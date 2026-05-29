import { type TFunction } from "i18next";
import { BaseEntity, createGenericDialogSlice, createGenericEntitySlice, createGenericFormSlice, type ValidationRule, Validators } from "yusr-ui";
import PaymentMethodsApiService from "../networking/paymentMethodApiService";

export const CommissionType = {
  Percent: 1,
  Amount: 2
} as const;
export type CommissionType = (typeof CommissionType)[keyof typeof CommissionType];

export default class PaymentMethod extends BaseEntity
{
  public name!: string;
  public accountId!: number;
  public accountName!: string;
  public commissionType!: CommissionType;
  public commissionAmount!: number;

  constructor(init?: Partial<PaymentMethod>)
  {
    super();
    Object.assign(this, init);
  }
}

export class PaymentMethodValidationRules
{
  public static validationRules = (t: TFunction<"accounting">): ValidationRule<Partial<PaymentMethod>>[] => [{
    field: "name",
    selector: (d) => d.name,
    validators: [Validators.required(t("paymentMethods.nameRequired"))]
  }, {
    field: "accountId",
    selector: (d) => d.accountId,
    validators: [Validators.required(t("paymentMethods.accountRequired"))]
  }, {
    field: "commissionType",
    selector: (d) => d.commissionType,
    validators: [Validators.required(t("paymentMethods.commissionTypeRequired"))]
  }, {
    field: "commissionAmount",
    selector: (d) => d.commissionAmount,
    validators: [Validators.required(t("paymentMethods.commissionValueRequired"))]
  }];
}

export class PaymentMethodSlice
{
  private static entitySliceInstance = createGenericEntitySlice("paymentMethod", new PaymentMethodsApiService());
  public static entityActions = PaymentMethodSlice.entitySliceInstance.actions;
  public static entityReducer = PaymentMethodSlice.entitySliceInstance.reducer;

  private static dialogSliceInstance = createGenericDialogSlice<PaymentMethod>("paymentMethodDialog");
  public static dialogActions = PaymentMethodSlice.dialogSliceInstance.actions;
  public static dialogReducer = PaymentMethodSlice.dialogSliceInstance.reducer;

  private static formSliceInstance = createGenericFormSlice<PaymentMethod>("paymentMethodForm");
  public static formActions = PaymentMethodSlice.formSliceInstance.actions;
  public static formReducer = PaymentMethodSlice.formSliceInstance.reducer;
}
