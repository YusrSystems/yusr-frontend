import { Banknote } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, cn, CurrencyIcon, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "yusr-ui";
import type { InvoiceProfitResult } from "@/core/data/invoices/InvoiceProfitResult.ts";
import InvoiceItemsMath from "../../logic/invoiceItemsMath";
import type Invoice from "@/core/data/invoices/invoice.ts";


interface ProfitRowProps
{
	label: string;
	value: number;
	showCurrency?: boolean;
	variant?: "default" | "profit";
}

export function ProfitRow({label, value, showCurrency = true, variant = "default"}: ProfitRowProps)
{
	return (
		<div className="flex justify-between items-center py-2.5 border-b border-border last:border-b-0">
			<span className="text-sm text-muted-foreground">{ label }</span>
			<span
				className={ cn(
					"inline-flex items-center gap-1 text-sm font-medium tabular-nums",
					variant === "profit" && value >= 0 && "text-emerald-600 dark:text-emerald-400",
					variant === "profit" && value < 0 && "text-red-600 dark:text-red-400",
					variant === "default" && "text-foreground"
				) }
			>
        <span>{ value.toLocaleString("en-US", {minimumFractionDigits: 2, maximumFractionDigits: 2}) }</span>
				{ showCurrency && <CurrencyIcon/> }
      </span>
		</div>
	);
}

export default function InvoiceProfitDialog({invoice}: { invoice: Invoice })
{
	const {t, i18n} = useTranslation("accounting");
	const [open, setOpen] = useState(false);

	const costVouchers = invoice.costVouchers();

	const profit: InvoiceProfitResult = InvoiceItemsMath.CalcInvoiceProfit(invoice.invoiceItems.value ?? [], costVouchers);

	return (
		<>
			<Button
				type="button"
				variant="outline"
				onClick={ () => setOpen(true) }
				className="text-green-700 dark:text-green-400 bg-green-500/20 dark:bg-green-500/20 w-full"
			>
				<Banknote className="h-4 w-4"/>
				{ t("invoices.invoiceProfit") }
			</Button>

			<Dialog open={ open } onOpenChange={ setOpen }>
				<DialogContent className="max-w-sm" dir={ i18n.dir() }>
					<DialogHeader>
						<DialogTitle>{ t("invoices.invoiceProfit") }</DialogTitle>
						<DialogDescription>{ t("invoices.profitSummary") }</DialogDescription>
					</DialogHeader>

					<div className="mt-2">
						<ProfitRow label={ t("invoices.totalPriceIncludingTax") }
						           value={ profit.taxInclusiveTotalPrice }/>
						<ProfitRow label={ t("invoices.totalCosts") } value={ profit.totalCost }/>
						<ProfitRow label={ t("invoices.totalTaxesAmount") } value={ profit.totalTaxesAmount }/>
						<ProfitRow label={ t("invoices.invoiceCosts") } value={ profit.invoiceCosts }/>
						<ProfitRow label={ t("invoices.netProfit") } value={ profit.profit } variant="profit"/>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}
