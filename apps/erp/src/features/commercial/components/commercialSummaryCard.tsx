import React from "react";
import { useTranslation } from "react-i18next";
import { cn } from "yusr-ui";
import { useSignals } from "@preact/signals-react/runtime";
import ErpCurrencyIcon from "@/core/components/erpCurrencyIcon";
import { CommercialMath, type ICommercialMathLine } from "../logic/commercialMath";
import type {
	CommercialDocument,
	ICommercialDocument,
	ICommercialDocumentDto
} from "@/core/data/commercial/commercialDocument";
import type { CommercialItem, ICommercialItemDto } from "@/core/data/commercial/commercialItem";
import { CommercialInvoiceDocument } from "@/core/data/commercial/commercialInvoiceDocument";


interface SummaryRowProps
{
	label: string;
	value: number;
	variant?: "default" | "paid" | "remaining";
}

function SummaryRow({
	label,
	value,
	variant = "default"
}: SummaryRowProps)
{
	return (
		<div
			className={ cn(
				"flex items-center justify-between py-2 text-sm",
				variant === "paid" && "text-emerald-600 dark:text-emerald-400",
				variant === "remaining" && "text-red-600 dark:text-red-400"
			) }
		>
			<span className="text-muted-foreground">{ label }</span>
			<div className="flex items-center gap-1 font-semibold tabular-nums">
				<span>
					{ value.toLocaleString("en-US", {
						minimumFractionDigits: 2,
						maximumFractionDigits: 2
					}) }
				</span>
				<ErpCurrencyIcon/>
			</div>
		</div>
	);
}

export interface CommercialSummaryCardProps<
	TDto extends ICommercialDocumentDto,
	TItem extends CommercialItem<TItemDto, ICommercialDocument>,
	TItemDto extends ICommercialItemDto
>
{
	document: CommercialDocument<TDto, TItem, TItemDto>;
	showPaymentSummary?: boolean;
	renderFooter?: React.ReactNode;
}

export function CommercialSummaryCard<
	TDto extends ICommercialDocumentDto,
	TItem extends CommercialItem<TItemDto, ICommercialDocument>,
	TItemDto extends ICommercialItemDto
>({
	document,
	showPaymentSummary = true,
	renderFooter
}: CommercialSummaryCardProps<TDto, TItem, TItemDto>)
{
	useSignals();
	const {t} = useTranslation("accounting");

	const lines: ICommercialMathLine[] = (document.items.value || []).map((i) => ({
		taxExclusivePrice: i.taxExclusivePrice.value,
		taxInclusivePrice: i.taxInclusivePrice.value,
		settlement: i.settlement.value,
		quantity: i.quantity.value,
		totalTaxesPerc: i.totalTaxesPerc.value
	}));

	const taxExclusive = CommercialMath.calcDocumentTaxExclusivePrice(lines);
	const taxInclusive = CommercialMath.calcDocumentTaxInclusivePrice(lines);

	const isInvoiceDoc = document instanceof CommercialInvoiceDocument;
	const paid = isInvoiceDoc ? document.paidAmount.value : 0;
	const unpaid = Math.max(0, taxInclusive - paid);

	return (
		<div className="border border-border rounded-xl bg-background overflow-hidden">
			<div className="px-4 py-3 border-b border-border bg-muted/30">
				<h3 className="font-semibold">{ t("invoices.invoiceSummary") }</h3>
			</div>
			<div className="px-4 py-2 divide-y divide-border">
				<SummaryRow label={ t("invoices.totalBeforeTax") } value={ taxExclusive }/>
				<SummaryRow label={ t("invoices.totalTaxes") } value={ taxInclusive - taxExclusive }/>
				<SummaryRow label={ t("invoices.totalAfterTax") } value={ taxInclusive }/>
				{ showPaymentSummary && isInvoiceDoc && (
					<>
						<SummaryRow label={ t("invoices.paidAmount") } value={ paid } variant="paid"/>
						<SummaryRow label={ t("invoices.remainingAmount") } value={ unpaid } variant="remaining"/>
					</>
				) }
				{ renderFooter && <div className="w-full pt-4 pb-2">{ renderFooter }</div> }
			</div>
		</div>
	);
}