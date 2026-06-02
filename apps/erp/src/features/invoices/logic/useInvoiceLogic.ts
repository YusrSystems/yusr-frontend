import Invoice, { InvoiceRelationType, InvoiceVoucher } from "@/core/data/invoice";
import type { SettingOld } from "@/core/data/settingOld";
import type { AuthState, UserOld } from "yusr-ui";

export function useInvoiceLogic(authState: AuthState<UserOld, SettingOld>)
{
  const createInitialPaymentVoucher = (invoice: Invoice, invoiceTaxInclusivePrice?: number): InvoiceVoucher =>
  {
    return {
      voucherId: 0,
      invoiceId: invoice.id ?? 0,
      paymentMethodId: authState.setting?.mainPaymentMethodId ?? 0,
      paymentMethodName: authState.setting?.mainPaymentMethodName ?? "",
      accountId: invoice.actionAccountId ?? 0,
      accountName: invoice.actionAccountName ?? "",
      invoiceRelationType: InvoiceRelationType.Payment,
      amount: invoiceTaxInclusivePrice ?? invoice.fullAmount ?? 0,
      amountReceived: invoiceTaxInclusivePrice ?? invoice.fullAmount ?? 0,
      description: undefined
    } as InvoiceVoucher;
  };

  return { createInitialPaymentVoucher };
}
