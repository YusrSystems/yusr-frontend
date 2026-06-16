import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources";
import { InvoiceType } from "@/core/data/invoiceOld.ts";
import { useTranslation } from "react-i18next";
import { cn, CurrencyIcon, SystemPermissionsActions } from "yusr-ui";
import InvoiceItemsMath from "../../logic/invoiceItemsMath";
import InvoiceProfitDialog from "../profit/InvoiceProfitDialog";
import type Invoice from "@/core/data/invoices/invoice.ts";
import { Services } from "@/core/services/services.ts";


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

				<CurrencyIcon/>
			</div>
		</div>
	);
}

export default function InvoiceSummary({invoice}: { invoice: Invoice })
{
	const {t} = useTranslation("accounting");

	const safe = (value: number) => Number.isFinite(value) ? value : 0;

	const taxExclusive = safe(
		InvoiceItemsMath.CalcInvoiceTaxExclusivePrice(
			invoice.invoiceItems.value ?? []
		)
	);

	const taxInclusive = safe(
		InvoiceItemsMath.CalcInvoiceTaxInclusivePrice(
			invoice.invoiceItems.value ?? []
		)
	);

	const paid = safe(
		InvoiceItemsMath.CalcInvoicePaidPrice(
			invoice.invoiceVouchers.value ?? []
		)
	);

	const unpaid = safe(
		InvoiceItemsMath.CalcInvoiceUnpaidPrice(
			invoice.invoiceItems.value ?? [],
			invoice.invoiceVouchers.value ?? []
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

				{ Services.auth.hasAuth(
					SystemPermissionsResources.InvoiceShowProfit,
					SystemPermissionsActions.Get
				)
				&& (invoice.type.value === InvoiceType.Sell || invoice.type.value === InvoiceType.Quotation)
					? (
						<div className="w-full flex items-end justify-end pt-4 pb-2">
							<InvoiceProfitDialog invoice={ invoice }/>
						</div>
					)
					: undefined }
			</div>
		</div>
	);
}
