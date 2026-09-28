import { apiClient, createCrudResource } from "yusr-ui";
import { type SalesInvoiceDto } from "@/core/data/commercial/salesInvoice";
import { type EInvoiceStatus } from "@/core/types/eInvoiceStatus";


export const salesInvoicesApi = {
	...createCrudResource<SalesInvoiceDto>("SalesInvoices"),

	getReturnDetails: (originalId: number) =>
		apiClient.get<SalesInvoiceDto>(`/api/SalesInvoices/GetReturnInvoiceInitialDetails/${ originalId }`),

	resendEInvoice: (id: number) =>
		apiClient.put<EInvoiceStatus>(`/api/SalesInvoices/ResendEInvoice/${ id }`)
};