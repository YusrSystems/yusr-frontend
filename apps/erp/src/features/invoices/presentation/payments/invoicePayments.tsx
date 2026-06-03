import PaymentMethodsSearchableSelect from "@/core/components/searchableSelect/paymentMethodsSearchableSelect";
import { Plus, Trash2, Wallet } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button, CrudEmptyTablePreview, CurrencyIcon, NumberFieldOld } from "yusr-ui";
import { InvoiceRelationType } from "../../../../core/data/invoice";
import { useInvoiceContext } from "../../logic/invoiceContext";
import InvoiceItemsMath from "../../logic/invoiceItemsMath";

export default function invoicePayments()
{
  const { t } = useTranslation("accounting");

  const {
    formData,
    authState,
    slice,
    dispatch
  } = useInvoiceContext();

  const paymentVouchers = () =>
    formData.invoiceVouchers?.filter(
      (v) => v.invoiceRelationType === InvoiceRelationType.Payment
    ) ?? [];

  const unpaidPrice = InvoiceItemsMath.CalcInvoiceUnpaidPrice(
    formData.invoiceItems ?? [],
    formData.invoiceVouchers ?? []
  );

  const vouchers = paymentVouchers();

  return (
    <div className="border border-border rounded-xl bg-background overflow-hidden">
      { /* Header */ }
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <Wallet className="w-4 h-4 text-muted-foreground" />
          <h3 className="font-semibold text-sm">
            { t("invoices.paymentVouchers") }
          </h3>
        </div>

        { unpaidPrice > 0 && (
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-8 gap-1.5 text-xs"
            onClick={ () =>
              dispatch(slice.formActions.addVoucher({
                voucherId: 0,
                invoiceId: formData.id ?? 0,
                paymentMethodId: authState.setting?.mainPaymentMethodId ?? 0,
                paymentMethodName: authState.setting?.mainPaymentMethodName ?? "",
                accountId: formData.actionAccountId ?? 0,
                accountName: formData.actionAccountName ?? "",
                invoiceRelationType: InvoiceRelationType.Payment,
                amount: 0,
                amountReceived: 0,
                description: undefined
              })) }
          >
            <Plus className="w-3.5 h-3.5" />
          </Button>
        ) }
      </div>

      { /* Column Headers — shown only when there are rows */ }
      { vouchers.length > 0 && (
        <div className="flex items-center gap-3 px-4 pt-3 pb-1">
          <span className="flex-1 text-xs font-medium text-muted-foreground">
            { t("invoices.paymentMethod") }
          </span>
          <span className="w-36 shrink-0 text-xs font-medium text-muted-foreground">
            { t("invoices.amount") }
          </span>
          { /* spacer to align with delete button */ }
          <span className="w-8 shrink-0" />
        </div>
      ) }

      { /* Voucher Rows */ }
      { vouchers.length > 0
        ? (
          <div className="divide-y divide-border">
            { vouchers.map((row) => (
              <div
                key={ row.voucherId }
                className="flex items-center gap-3 px-4 py-2"
              >
                { /* Payment Method — label-free, column header above */ }
                <div className="flex-1 min-w-0">
                  <PaymentMethodsSearchableSelect
                    selectedId={ row.paymentMethodId }
                    selectedLabel={ row.paymentMethodName }
                    onValueChange={ (pm) =>
                      dispatch(slice.formActions.updateVoucher({
                        ...row,
                        paymentMethodId: pm?.id,
                        paymentMethodName: pm?.name
                      })) }
                  />
                </div>

                { /* Amount — label-free */ }
                <div className="w-36 shrink-0">
                  <NumberFieldOld
                    min={ 0 }
                    max={ unpaidPrice + (row.amount ?? 0) }
                    value={ row.amount || "0" }
                    onChange={ (val) =>
                    {
                      if (val != undefined)
                      {
                        dispatch(slice.formActions.updateVoucher({ ...row, amount: val }));
                      }
                    } }
                    currency={ <CurrencyIcon /> }
                  />
                </div>

                { /* Delete */ }
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="w-8 shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  onClick={ () => dispatch(slice.formActions.removeVoucher(row.voucherId)) }
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            )) }
          </div>
        )
        : <CrudEmptyTablePreview mode="empty" /> }
    </div>
  );
}
