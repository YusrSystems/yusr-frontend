import { Banknote } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, cn, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "yusr-ui";
import { useSignals } from "@preact/signals-react/runtime";
import {
	CommercialMath,
	type ICommercialDocumentProfit,
	type ICommercialMathLine
} from "@/features/commercial/logic/commercialMath.ts";
import ErpCurrencyIcon from "@/core/components/erpCurrencyIcon.tsx";
import {
	CommercialDocument,
	type ICommercialDocument,
	type ICommercialDocumentDto
} from "@/core/data/commercial/commercialDocument.ts";
import type { CommercialItem, ICommercialItemDto } from "@/core/data/commercial/commercialItem.ts";
import { SalesInvoice } from "@/core/data/commercial/salesInvoice.ts";


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
		<div className="flex justify-between items-center py-2.5 border-b border-border last:border-b-0 gap-2">
			<span className="text-xs sm:text-sm text-muted-foreground">{ label }</span>
			<span
				className={ cn(
					"inline-flex items-center gap-1 text-xs sm:text-sm font-medium tabular-nums shrink-0",
					variant === "profit" && value >= 0 && "text-emerald-600 dark:text-emerald-400 font-bold",
					variant === "profit" && value < 0 && "text-red-600 dark:text-red-400 font-bold",
					variant === "default" && "text-foreground"
				) }
			>
				<span>{ value.toLocaleString("en-US", {minimumFractionDigits: 2, maximumFractionDigits: 2}) }</span>
				{ showCurrency && <ErpCurrencyIcon/> }
			</span>
		</div>
	);
}

export interface InvoiceProfitDialogProps<
	TDto extends ICommercialDocumentDto,
	TItem extends CommercialItem<TItemDto, ICommercialDocument>,
	TItemDto extends ICommercialItemDto
>
{
	invoice: CommercialDocument<TDto, TItem, TItemDto>;
}

export default function InvoiceProfitDialog<
	TDto extends ICommercialDocumentDto,
	TItem extends CommercialItem<TItemDto, ICommercialDocument>,
	TItemDto extends ICommercialItemDto
>({invoice}: InvoiceProfitDialogProps<TDto, TItem, TItemDto>)
{
	useSignals();
	const {t, i18n} = useTranslation("accounting");
	const [open, setOpen] = useState(false);

	const mathLines: ICommercialMathLine[] = (invoice.items.value || []).map((i) => ({
		taxExclusivePrice: i.taxExclusivePrice.value,
		taxInclusivePrice: i.taxInclusivePrice.value,
		settlement: i.settlement.value,
		quantity: i.quantity.value,
		totalTaxesPerc: i.totalTaxesPerc.value,
		cost: i.cost.value
	}));

	const hasDirectCosts = invoice instanceof SalesInvoice;

	const directCostsAmount = hasDirectCosts
		? (invoice.costVouchers.value || []).reduce(
			(sum, v) => sum + (v.amount.value ?? 0),
			0
		)
		: 0;

	const profit: ICommercialDocumentProfit = CommercialMath.calcDocumentProfit(
		mathLines,
		directCostsAmount
	);

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
				<DialogContent className="max-w-sm max-h-[94dvh] flex flex-col overflow-hidden" dir={ i18n.dir() }>
					<DialogHeader className="shrink-0">
						<DialogTitle>{ t("invoices.invoiceProfit") }</DialogTitle>
						<DialogDescription>{ t("invoices.profitSummary") }</DialogDescription>
					</DialogHeader>

					<div className="flex-1 min-h-0 overflow-y-auto mt-2 px-1">
						<ProfitRow label={ t("invoices.totalPriceIncludingTax") }
						           value={ profit.taxInclusiveTotalPrice }/>
						<ProfitRow label={ t("invoices.totalCosts") } value={ profit.totalCost }/>
						<ProfitRow label={ t("invoices.totalTaxesAmount") } value={ profit.totalTaxesAmount }/>
						{ hasDirectCosts && (
							<ProfitRow label={ t("invoices.invoiceCosts") } value={ profit.directCosts }/>
						) }
						<ProfitRow label={ t("invoices.netProfit") } value={ profit.profit } variant="profit"/>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}