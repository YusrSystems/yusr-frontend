import { type TFunction } from "i18next";
import { BaseEntity, createGenericDialogSlice, createGenericEntitySlice, createGenericFormSlice, type ValidationRuleOld, Validators } from "yusr-ui";
import VouchersApiService from "../networking/voucherApiService";
import type PaymentMethod from "./paymentMethod";

export const VoucherType = {
  Payment: 1,
  Receipt: 2
} as const;

export type VoucherType = (typeof VoucherType)[keyof typeof VoucherType];

export default class Voucher extends BaseEntity
{
  public type!: VoucherType;
  public date!: string | Date;
  public amount!: number;
  public isAmountDue!: boolean;
  public commissionAmount!: number;
  public accountId!: number;
  public paymentMethodId!: number;
  public description?: string;
  public invoiceId?: number;
  public giver?: string;
  public recipient?: string;

  public accountName?: string;
  public paymentMethod?: PaymentMethod;

  constructor(init?: Partial<Voucher>)
  {
    super();
    Object.assign(this, init);
  }
}

export class VoucherValidationRules
{
  public static validationRules = (t: TFunction<"accounting">): ValidationRuleOld<Partial<Voucher>>[] => [{
    field: "type",
    selector: (d) => d.type,
    validators: [Validators.required(t("vouchers.typeRequired"))]
  }, {
    field: "date",
    selector: (d) => d.date,
    validators: [Validators.required(t("vouchers.dateRequired"))]
  }, {
    field: "amount",
    selector: (d) => d.amount,
    validators: [Validators.required(t("vouchers.amountRequired"))]
  }, {
    field: "accountId",
    selector: (d) => d.accountId,
    validators: [Validators.required(t("vouchers.accountRequired"))]
  }, {
    field: "paymentMethodId",
    selector: (d) => d.paymentMethodId,
    validators: [Validators.required(t("vouchers.paymentMethodRequired"))]
  }];
}

export class VoucherSlice
{
  private static entitySliceInstance = createGenericEntitySlice("voucher", new VouchersApiService());
  public static entityActions = VoucherSlice.entitySliceInstance.actions;
  public static entityReducer = VoucherSlice.entitySliceInstance.reducer;

  private static dialogSliceInstance = createGenericDialogSlice<Voucher>("voucherDialog");
  public static dialogActions = VoucherSlice.dialogSliceInstance.actions;
  public static dialogReducer = VoucherSlice.dialogSliceInstance.reducer;

  private static formSliceInstance = createGenericFormSlice<Voucher>("voucherForm");
  public static formActions = VoucherSlice.formSliceInstance.actions;
  public static formReducer = VoucherSlice.formSliceInstance.reducer;
}
