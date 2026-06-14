import type { PayloadAction } from "@reduxjs/toolkit";
import type { IFormState } from "yusr-ui";
import InvoiceOld, { InvoiceRelationType, InvoiceVoucherOld } from "../../../core/data/invoiceOld.ts";

export default class InvoiceVouchersActions
{
  public static removeVoucher(state: IFormState<InvoiceOld>, action: PayloadAction<number>)
  {
    const id = action.payload;
    state.formData.invoiceVouchers = state.formData.invoiceVouchers?.filter((voucher) => voucher.voucherId !== id);
    delete state.errors[id];
    delete state.errors[`${id}_method`];
  }

  public static updateVoucher(
    state: IFormState<InvoiceOld>,
    action: PayloadAction<InvoiceVoucherOld>
  )
  {
    const index = state.formData.invoiceVouchers?.findIndex((v) => v.voucherId === action.payload.voucherId);
    if (index === -1)
    {
      return;
    }
    if (index != undefined && state.formData.invoiceVouchers != undefined)
    {
      state.formData.invoiceVouchers[index] = action.payload;
    }
  }

  public static addVoucher(state: IFormState<InvoiceOld>, action: PayloadAction<InvoiceVoucherOld>)
  {
    const baseVoucher = action.payload;

    const tempId = -(Math.floor(Date.now() / 1000) * 1000 + Math.floor(Math.random() * 1000));

    state.formData.invoiceVouchers?.push({
      invoiceId: baseVoucher.invoiceId,
      voucherId: tempId,
      accountId: baseVoucher.accountId,
      accountName: baseVoucher.accountName,
      invoiceRelationType: baseVoucher.invoiceRelationType,
      paymentMethodId: baseVoucher.paymentMethodId,
      paymentMethodName: baseVoucher.paymentMethodName,
      amount: baseVoucher.amount,
      amountReceived: baseVoucher.amountReceived,
      description: baseVoucher.description
    });
  }

  public static resetPaymentVouchers(state: IFormState<InvoiceOld>, _action: PayloadAction<void>)
  {
    state.formData.invoiceVouchers = state.formData.invoiceVouchers?.filter((v) =>
      v.invoiceRelationType !== InvoiceRelationType.Payment
    );
  }
}
