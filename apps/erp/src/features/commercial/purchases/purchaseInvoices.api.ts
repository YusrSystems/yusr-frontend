import { PurchaseInvoiceDto } from "@/core/data/commercial/purchaseInvoice";
import { apiClient, createCrudResource } from "#/api";


export const purchaseInvoicesApi = {
	...createCrudResource<PurchaseInvoiceDto>("PurchaseInvoices"),
	getReturnInvoiceInitialDetails: (originalPurchaseInvoiceId: number) =>
		apiClient.get<PurchaseInvoiceDto>(
			`/api/PurchaseInvoices/GetReturnInvoiceInitialDetails/${ originalPurchaseInvoiceId }`
		)
};