import { BaseApiService, type RequestResult, YusrApiHelper } from "yusr-ui";
import { InvoiceDto } from "@/core/data/invoices/invoice.ts";
import type { EInvoiceStatus } from "@/core/types/eInvoiceStatus.ts";


export default class InvoicesApiService extends BaseApiService<InvoiceDto>
{
	constructor()
	{
		super("Invoices");
	}

	async GetReturnInvoiceInitialDetails(id: number): Promise<RequestResult<InvoiceDto>>
	{
		return await YusrApiHelper.Get<InvoiceDto>(`/api/${ this.routeName }/GetReturnInvoiceInitialDetails/${ id }`);
	}

	async ResendEInvoice(invoiceId: number): Promise<RequestResult<EInvoiceStatus>>
	{
		return await YusrApiHelper.Put(
			`/api/${ this.routeName }/ResendEInvoice/${ invoiceId }`
		);
	}
}
