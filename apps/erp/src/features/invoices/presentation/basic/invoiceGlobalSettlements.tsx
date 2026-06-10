// InvoiceGlobalSettlements.tsx

import { useTranslation } from "react-i18next";
import { FieldsSection, NumberFieldOld, TextAreaFieldOld } from "yusr-ui";
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

      <div className="p-4 flex flex-col gap-3">
        <FieldsSection columns={ 2 }>
          <NumberFieldOld
            label={ t("paymentMethods.fixedAmount") }
            className="mt-1"
            value={ formData.settlementAmount ?? 0 }
            onChange={ (newValue) =>
              dispatch(
                slice.formActions.onInvoiceSettlementAmountChange(
                  Number(newValue) ?? 0
                )
              ) }
            disabled={ disabled || mode === "return" || formData.invoiceItems?.length === 0 }
          />
          <NumberFieldOld
            label={ t("paymentMethods.percentage") }
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
            disabled={ disabled || mode === "return" || formData.invoiceItems?.length === 0 }
          />
        </FieldsSection>

        <TextAreaFieldOld
          label={ t("invoices.settlementReason") }
          value={ formData.settlementReason }
          onChange={ (e) =>
            dispatch(
              slice.formActions.updateFormData({ settlementReason: e.target.value })
            ) }
          disabled={ disabled || mode === "return" || formData.invoiceItems?.length === 0
            || (formData.settlementPercent === 0 && formData.settlementAmount === 0) }
          collapsible
        />
      </div>
    </div>
  );
}
