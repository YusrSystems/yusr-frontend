import Invoice, { InvoiceRelationType, InvoiceVoucher } from "@/core/data/invoice";
import type { Setting } from "@/core/data/setting";
import type { AuthState, User } from "yusr-ui";

export function useInvoiceLogic(authState: AuthState<User, Setting>)
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
