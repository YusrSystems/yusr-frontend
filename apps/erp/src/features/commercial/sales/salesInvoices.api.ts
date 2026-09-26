import { SalesInvoiceDto } from "@/core/data/commercial/salesInvoice";
import type { EInvoiceStatus } from "@/core/types/eInvoiceStatus";
import { apiClient, createCrudResource } from "#/api";


export const salesInvoicesApi = {
	...createCrudResource<SalesInvoiceDto>("SalesInvoices"),
	getReturnInvoiceInitialDetails: (originalSalesInvoiceId: number) =>
		apiClient.get<SalesInvoiceDto>(
			`/api/SalesInvoices/GetReturnInvoiceInitialDetails/${ originalSalesInvoiceId }`
		),
	resendEInvoice: (id: number) =>
		apiClient.put<EInvoiceStatus>(`/api/SalesInvoices/ResendEInvoice/${ id }`)
};