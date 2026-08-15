import { InvoiceDto } from "@/core/data/invoices/invoice.ts";
import { Services } from "@/core/services/services.ts";
import type { TFunction } from "i18next";


export enum PaymentStatus
{
	NotPaid,
	PartiallyPaid,
	FullyPaid,
	Overpaid
}

export function getPaymentStatus(invoice: InvoiceDto, t: TFunction<"accounting">): { message: string; styles: string; }
{
	if (invoice.paymentStatusId === PaymentStatus.NotPaid)
	{
		return {message: t("invoices.notPaid"), styles: "bg-red-100 text-red-800"};
	}

	if (invoice.paymentStatusId === PaymentStatus.FullyPaid)
	{
		return {message: t("invoices.fullyPaid"), styles: "bg-green-100 text-green-800"};
	}

	if (invoice.paymentStatusId === PaymentStatus.Overpaid)
	{
		return {message: t("invoices.overpaid"), styles: "bg-red-100 text-red-800"};
	}

	return {
		message: t("invoices.partiallyPaid", {
			amount: invoice.paidAmount,
			currency: Services.auth.setting?.currency?.value.code.value
		}),
		styles: "bg-orange-100 text-orange-800"
	};
};