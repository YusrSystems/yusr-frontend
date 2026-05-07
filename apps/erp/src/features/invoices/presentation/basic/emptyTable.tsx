import { useTranslation } from "react-i18next";
import { useInvoiceContext } from "../../logic/invoiceContext";

export default function EmptyTable()
{
  const { t } = useTranslation("accounting");
  const {
    isInvalid,
    getError
  } = useInvoiceContext();

  return (
    <div
      className={ `flex flex-col items-center justify-center p-10 text-center text-muted-foreground border border-dashed border-border rounded-lg bg-background/50
      ${isInvalid("invoiceItems") ? "error" : ""}
    ` }
    >
      <p>{ t("invoices.emptyTable") }</p>
      <p className="text-xs mt-1">{ t("invoices.emptyTableHint") }</p>
      { isInvalid("invoiceItems") && (
        <div className="text-base font-medium text-red-500 mt-8 animate-in fade-in slide-in-from-top-1">
          { getError("invoiceItems") }
        </div>
      ) }
    </div>
  );
}
