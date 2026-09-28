import { apiClient, createCrudResource } from "yusr-ui";
import { type PurchaseInvoiceDto } from "@/core/data/commercial/purchaseInvoice";


export const purchaseInvoicesApi = {
	...createCrudResource<PurchaseInvoiceDto>("PurchaseInvoices"),

	getReturnDetails: (originalId: number) =>
		apiClient.get<PurchaseInvoiceDto>(`/api/PurchaseInvoices/GetReturnInvoiceInitialDetails/${ originalId }`)
};