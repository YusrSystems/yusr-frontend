import ClientsAndSuppliersSearchableSelect from "@/core/components/searchableSelect/clientsAndSuppliersSearchableSelect";
import PaymentMethodsSearchableSelect from "@/core/components/searchableSelect/paymentMethodsSearchableSelect";
import { Plus, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button, CurrencyIcon, FormField, NumberField, TextFieldOld } from "yusr-ui";
import { InvoiceRelationType } from "../../../../core/data/invoice";
import { useInvoiceContext } from "../../logic/invoiceContext";

export default function InvoiceCostsTab()
{
  const { t } = useTranslation("accounting");
  const {
    formData,
    authState,
    slice,
    dispatch
  } = useInvoiceContext();

  const costVouchers = () =>
    formData.invoiceVouchers?.filter((v) => v.invoiceRelationType == InvoiceRelationType.Cost) ?? [];

  return (
    <div className="flex flex-col gap-2 items-end">
      <Button
        type="button"
        className="max-w-45"
        size="lg"
        onClick={ () =>
          dispatch(slice.formActions.addVoucher(
            {
              voucherId: 0,
              invoiceId: formData.id ?? 0,
              paymentMethodId: authState.setting?.mainPaymentMethodId ?? 0,
              paymentMethodName: authState.setting?.mainPaymentMethodName ?? "",
              accountId: formData.actionAccountId ?? 0,
              accountName: formData.actionAccountName ?? "",
              invoiceRelationType: InvoiceRelationType.Cost,
              amount: 0,
              amountReceived: 0,
              description: undefined
            }
          )) }
      >
        <Plus className="w-4 h-4 me-2" /> { t("invoices.addCostVoucher") }
      </Button>

      <div className="w-full overflow-x-auto border border-border rounded-lg shadow-sm bg-background">
        <table className="w-full text-sm text-right">
          <thead className="bg-muted/40 border-b border-border">
            <tr>
              <th className="p-3 font-semibold w-16 text-center text-muted-foreground">{ t("invoices.number") }</th>
              <th className="p-3 text-start font-semibold">{ t("invoices.account") }</th>
              <th className="p-3 text-start font-semibold">{ t("invoices.paymentMethod") }</th>
              <th className="p-3 text-start font-semibold">{ t("invoices.amount") }</th>
              <th className="p-3 text-start font-semibold">{ t("invoices.description") }</th>
              <th className="p-4 text-start font-semibold w-16"></th>
            </tr>
          </thead>
          <tbody>
            { costVouchers().map((row, index) => (
              <tr
                key={ row.voucherId }
                className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
              >
                <td className="p-2 text-center font-bold text-muted-foreground">{ index + 1 }</td>

                <td className="p-2">
                  <FormField label="">
                    <ClientsAndSuppliersSearchableSelect
                      selectedId={ row.accountId }
                      selectedLabel={ row.accountName }
                      onValueChange={ (account) =>
                      {
                        dispatch(slice.formActions.updateVoucher({
                          ...row,
                          accountId: account?.id,
                          accountName: account?.name
                        }));
                      } }
                    />
                  </FormField>
                </td>

                <td className="p-2">
                  <FormField label="">
                    <PaymentMethodsSearchableSelect
                      selectedId={ row.paymentMethodId }
                      selectedLabel={ row.paymentMethodName }
                      onValueChange={ (pm) =>
                      {
                        dispatch(slice.formActions.updateVoucher({
                          ...row,
                          paymentMethodId: pm?.id,
                          paymentMethodName: pm?.name
                        }));
                      } }
                    />
                  </FormField>
                </td>

                <td className="p-2">
                  <NumberField
                    label=""
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
                </td>

                <td className="p-2">
                  <TextFieldOld
                    label=""
                    value={ row.description || "" }
                    onChange={ (e) =>
                      dispatch(slice.formActions.updateVoucher({ ...row, description: e.target.value })) }
                  />
                </td>

                <td className="p-4 text-center align-top pt-5">
                  <button
                    type="button"
                    onClick={ () =>
                    {
                      dispatch(slice.formActions.removeVoucher(row.voucherId));
                    } }
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-500/10 rounded-md transition-colors"
                    aria-label={ t("invoices.deleteVoucher") }
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            )) }
          </tbody>
        </table>
      </div>
    </div>
  );
}
