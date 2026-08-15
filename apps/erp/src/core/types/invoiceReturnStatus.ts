import { InvoiceDto } from "@/core/data/invoices/invoice.ts";
import type { TFunction } from "i18next";


export enum InvoiceReturnStatus
{
	NotReturned = 0,
	PartialReturned = 1,
	FullyReturned = 2
}

export function getReturnStatus(invoice: InvoiceDto, t: TFunction<"accounting">): { message: string; styles: string; }
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
