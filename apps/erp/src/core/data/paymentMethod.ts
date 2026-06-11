import { type TFunction } from "i18next";
import { BaseEntity, createGenericDialogSlice, createGenericEntitySlice, createGenericFormSlice, type ValidationRuleOld, Validators } from "yusr-ui";
import PaymentMethodsApiServiceOld from "../networking/paymentMethodApiServiceOld";

export const CommissionTypeOld = {
  Percent: 1,
  Amount: 2
} as const;
export type CommissionTypeOld = (typeof CommissionTypeOld)[keyof typeof CommissionTypeOld];

export default class PaymentMethodOld extends BaseEntity
{
  public name!: string;
  public accountId!: number;
  public accountName!: string;
  public commissionType!: CommissionTypeOld;
  public commissionAmount!: number;

  constructor(init?: Partial<PaymentMethodOld>)
  {
    super();
    Object.assign(this, init);
  }
}

export class PaymentMethodValidationRules
{
  public static validationRules = (t: TFunction<"accounting">): ValidationRuleOld<Partial<PaymentMethodOld>>[] => [{
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
  private static entitySliceInstance = createGenericEntitySlice("paymentMethod", new PaymentMethodsApiServiceOld());
  public static entityActions = PaymentMethodSlice.entitySliceInstance.actions;
  public static entityReducer = PaymentMethodSlice.entitySliceInstance.reducer;

  private static dialogSliceInstance = createGenericDialogSlice<PaymentMethodOld>("paymentMethodDialog");
  public static dialogActions = PaymentMethodSlice.dialogSliceInstance.actions;
  public static dialogReducer = PaymentMethodSlice.dialogSliceInstance.reducer;

  private static formSliceInstance = createGenericFormSlice<PaymentMethodOld>("paymentMethodForm");
  public static formActions = PaymentMethodSlice.formSliceInstance.actions;
  public static formReducer = PaymentMethodSlice.formSliceInstance.reducer;
}
