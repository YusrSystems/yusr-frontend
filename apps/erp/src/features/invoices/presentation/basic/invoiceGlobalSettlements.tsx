// InvoiceGlobalSettlements.tsx

import { useTranslation } from "react-i18next";
import { NumberInput } from "yusr-ui";
import { useInvoiceContext } from "../../logic/invoiceContext";

export default function InvoiceGlobalSettlements()
{
  const { t } = useTranslation("accounting");

  const {
    mode,
    formData,
    dispatch,
    slice,
    disabled
  } = useInvoiceContext();

  return (
    <div className="border border-border rounded-xl bg-background overflow-hidden">
      <div className="px-4 py-3 border-b border-border bg-muted/30">
        <h3 className="font-semibold">
          { t("invoices.globalSettlement") }
        </h3>
      </div>

      <div className="p-4 grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-sm text-muted-foreground">
            { t("paymentMethods.fixedAmount") }
          </label>

          <NumberInput
            className="mt-1"
            value={ formData.settlementAmount ?? 0 }
            onChange={ (newValue) =>
              dispatch(
                slice.formActions.onInvoiceSettlementAmountChange(
                  Number(newValue) ?? 0
                )
              ) }
            disabled={ disabled || mode === "return" }
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm text-muted-foreground">
            { t("paymentMethods.percentage") }
          </label>

          <NumberInput
            min={ -100 }
            max={ 100 }
            className="mt-1"
            value={ formData.settlementPercent ?? 0 }
            onChange={ (newValue) =>
              dispatch(
                slice.formActions.onInvoiceSettlementPercentChange(
                  Number(newValue) ?? 0
                )
              ) }
            disabled={ disabled || mode === "return" }
          />
        </div>
      </div>
    </div>
  );
}
