import { BaseApiService, type RequestResult, YusrApiHelper } from "yusr-ui";
import { SalesInvoiceDto } from "@/core/data/commercial/salesInvoice";
import type { EInvoiceStatus } from "@/core/types/eInvoiceStatus";


export default class SalesInvoicesApiService extends BaseApiService<SalesInvoiceDto>
{
	constructor()
	{
		super("SalesInvoices");
	}

	async GetReturnInvoiceInitialDetails(id: number): Promise<RequestResult<SalesInvoiceDto>>
	{
		return await YusrApiHelper.Get<SalesInvoiceDto>(
			`/api/${ this.routeName }/GetReturnInvoiceInitialDetails/${ id }`
		);
	}

	async ResendEInvoice(invoiceId: number): Promise<RequestResult<EInvoiceStatus>>
	{
		return await YusrApiHelper.Put<EInvoiceStatus>(
			`/api/${ this.routeName }/ResendEInvoice/${ invoiceId }`
		);
	}
}