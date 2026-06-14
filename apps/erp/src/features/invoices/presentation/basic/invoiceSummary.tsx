import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources";
import { InvoiceType } from "@/core/data/invoiceOld.ts";
import { useTranslation } from "react-i18next";
import { cn, CurrencyIcon, SystemPermissions, SystemPermissionsActions } from "yusr-ui";
import { useInvoiceContext } from "../../logic/invoiceContext";
import InvoiceItemsMath from "../../logic/invoiceItemsMath";
import InvoiceProfitDialog from "../profit/InvoiceProfitDialog";

function SummaryRow({
  label,
  value,
  variant = "default"
}: {
  label: string;
  value: number;
  variant?: "default" | "paid" | "remaining";
})
{
  return (
    <div
      className={ cn(
        "flex items-center justify-between py-2 text-sm",
        variant === "paid"
          && "text-emerald-600 dark:text-emerald-400",
        variant === "remaining"
          && "text-red-600 dark:text-red-400"
      ) }
    >
      <span className="text-muted-foreground">
        { label }
      </span>

      <div className="flex items-center gap-1 font-semibold tabular-nums">
        <span>
          { value.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }) }
        </span>

        <CurrencyIcon />
      </div>
    </div>
  );
}

export default function invoiceSummary()
{
  const { t } = useTranslation("accounting");
  const { formData, authState } = useInvoiceContext();

  const safe = (value: number) => Number.isFinite(value) ? value : 0;

  const taxExclusive = safe(
    InvoiceItemsMath.CalcInvoiceTaxExclusivePrice(
      formData.invoiceItems ?? []
    )
  );

  const taxInclusive = safe(
    InvoiceItemsMath.CalcInvoiceTaxInclusivePrice(
      formData.invoiceItems ?? []
    )
  );

  const paid = safe(
    InvoiceItemsMath.CalcInvoicePaidPrice(
      formData.invoiceVouchers ?? []
    )
  );

  const unpaid = safe(
    InvoiceItemsMath.CalcInvoiceUnpaidPrice(
      formData.invoiceItems ?? [],
      formData.invoiceVouchers ?? []
    )
  );
  return (
    <div className="border border-border rounded-xl bg-background overflow-hidden">
      <div className="px-4 py-3 border-b border-border bg-muted/30">
        <h3 className="font-semibold">
          { t("invoices.invoiceSummary") }
        </h3>
      </div>

      <div className="px-4 py-2 divide-y divide-border">
        <SummaryRow
          label={ t("invoices.totalBeforeTax") }
          value={ taxExclusive }
        />

        <SummaryRow
          label={ t("invoices.totalTaxes") }
          value={ taxInclusive - taxExclusive }
        />

        <SummaryRow
          label={ t("invoices.totalAfterTax") }
          value={ taxInclusive }
        />

        <SummaryRow
          label={ t("invoices.paidAmount") }
          value={ paid }
          variant="paid"
        />

        <SummaryRow
          label={ t("invoices.remainingAmount") }
          value={ unpaid }
          variant="remaining"
        />

        { SystemPermissions.hasAuth(
            authState.loggedInUser?.role?.permissions ?? [],
            SystemPermissionsResources.InvoiceShowProfit,
            SystemPermissionsActions.Get
          ) && (
            formData.type === InvoiceType.Sell
            || formData.type === InvoiceType.Quotation
          )
          ? (
            <div className="w-full flex items-end justify-end pt-4 pb-2">
              <InvoiceProfitDialog />
            </div>
          )
          : undefined }
      </div>
    </div>
  );
}
