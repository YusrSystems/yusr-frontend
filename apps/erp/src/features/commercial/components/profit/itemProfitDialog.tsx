import { Banknote } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "yusr-ui";
import { useSignals } from "@preact/signals-react/runtime";
import { CommercialMath, type ICommercialLineProfit } from "@/features/commercial/logic/commercialMath.ts";
import { ProfitRow } from "./invoiceProfitDialog.tsx";
import type { CommercialItem, ICommercialItemDto } from "@/core/data/commercial/commercialItem.ts";
import type { ICommercialDocument } from "@/core/data/commercial/commercialDocument.ts";


export interface ItemProfitDialogProps
{
	invoiceItem: CommercialItem<ICommercialItemDto, ICommercialDocument>;
}

export function ItemProfitDialog({invoiceItem}: ItemProfitDialogProps)
{
	useSignals();
	const {t, i18n} = useTranslation("accounting");
	const [open, setOpen] = useState(false);

	const profit: ICommercialLineProfit = CommercialMath.calcLineProfit({
		taxExclusivePrice: invoiceItem.taxExclusivePrice.value,
		taxInclusivePrice: invoiceItem.taxInclusivePrice.value,
		settlement: invoiceItem.settlement.value,
		quantity: invoiceItem.quantity.value,
		totalTaxesPerc: invoiceItem.totalTaxesPerc.value,
		cost: invoiceItem.cost.value
	});

	return (
		<>
			<button
				type="button"
				onClick={ () => setOpen(true) }
				className="p-2 text-emerald-500 hover:text-emerald-700 hover:bg-emerald-500/10 rounded-md transition-colors"
				aria-label={ t("invoices.viewItemProfit") }
			>
				<Banknote className="h-5 w-5"/>
			</button>

			<Dialog open={ open } onOpenChange={ setOpen }>
				<DialogContent className="max-w-sm max-h-[94dvh] flex flex-col overflow-hidden" dir={ i18n.dir() }>
					<DialogHeader className="shrink-0">
						<DialogTitle>{ t("invoices.itemProfit") }</DialogTitle>
						<DialogDescription className="truncate">{ invoiceItem.itemName.value }</DialogDescription>
					</DialogHeader>

					<div className="flex-1 min-h-0 overflow-y-auto mt-2 px-1">
						<ProfitRow label={ t("invoices.priceIncludingTax") } value={ profit.taxInclusivePrice }/>
						<ProfitRow label={ t("invoices.cost") } value={ profit.cost }/>
						<ProfitRow label={ t("invoices.totalTaxesAmount") } value={ profit.totalTaxesAmount }/>
						<ProfitRow label={ t("invoices.quantity") } value={ profit.quantity } showCurrency={ false }/>
						<ProfitRow label={ t("invoices.profitPerUnit") } value={ profit.profit } variant="profit"/>
						<ProfitRow label={ t("invoices.totalProfit") } value={ profit.totalProfit } variant="profit"/>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}