import { Banknote } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "yusr-ui";
import type { InvoiceItemProfitResult } from "@/core/data/invoices/InvoiceItemProfitResult.ts";
import InvoiceItemsMath from "../../logic/invoiceItemsMath";
import { ProfitRow } from "./InvoiceProfitDialog";
import type { InvoiceItem } from "@/core/data/invoices/invoiceItem.ts";


interface ItemProfitDialogProps
{
	invoiceItem: InvoiceItem;
}

export function ItemProfitDialog({invoiceItem}: ItemProfitDialogProps)
{
	const {t, i18n} = useTranslation("accounting");
	const [open, setOpen] = useState(false);

	const profit: InvoiceItemProfitResult = InvoiceItemsMath.CalcInvoiceItemProfit(invoiceItem);

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
				<DialogContent className="max-w-sm" dir={ i18n.dir() }>
					<DialogHeader>
						<DialogTitle>{ t("invoices.itemProfit") }</DialogTitle>
						<DialogDescription>{ invoiceItem.itemName }</DialogDescription>
					</DialogHeader>

					<div className="mt-2">
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
