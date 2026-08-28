import type { TFunction } from "i18next";
import type { SalesInvoiceDto } from "@/core/data/commercial/salesInvoice.ts";
import type { PurchaseInvoiceDto } from "@/core/data/commercial/purchaseInvoice.ts";


export enum InvoiceReturnStatus
{
	NotReturned = 0,
	PartialReturned = 1,
	FullyReturned = 2
}

export function getReturnStatus(invoice: SalesInvoiceDto | PurchaseInvoiceDto, t: TFunction<"accounting">): {
	message: string;
	styles: string;
}
{
	if (invoice.returnStatusId === InvoiceReturnStatus.NotReturned)
	{
		return {message: t("invoices.notReturned"), styles: "bg-green-100 text-green-800"};
	}

	if (invoice.returnStatusId === InvoiceReturnStatus.FullyReturned)
	{
		return {message: t("invoices.fullyReturned"), styles: "bg-red-100 text-red-800"};
	}

	return {
		message: t("invoices.partialReturned"),
		styles: "bg-orange-100 text-orange-800"
	};
}
