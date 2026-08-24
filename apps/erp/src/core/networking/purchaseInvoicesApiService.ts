import { BaseApiService, type RequestResult, YusrApiHelper } from "yusr-ui";
import { PurchaseInvoiceDto } from "@/core/data/commercial/purchaseInvoice";


export default class PurchaseInvoicesApiService extends BaseApiService<PurchaseInvoiceDto>
{
	constructor()
	{
		super("PurchaseInvoices");
	}

	async GetReturnInvoiceInitialDetails(id: number): Promise<RequestResult<PurchaseInvoiceDto>>
	{
		return await YusrApiHelper.Get<PurchaseInvoiceDto>(
			`/api/${ this.routeName }/GetReturnInvoiceInitialDetails/${ id }`
		);
	}
}