import { BaseApiService, type RequestResult, YusrApiHelper } from "yusr-ui";
import Invoice, { InvoiceDto, InvoiceMode } from "@/core/data/invoices/invoice.ts";
import type { EInvoiceStatus } from "@/core/types/eInvoiceStatus.ts";


export default class InvoicesApiService extends BaseApiService<Invoice, InvoiceDto>
{
	routeName: string = "Invoices";

	override createEntity(dto: InvoiceDto): Invoice
	{
		return new Invoice(dto, InvoiceMode.Create);
	}

	async GetReturnInvoiceInitialDetails(id: number): Promise<RequestResult<Invoice>>
	{
		const rawResult = await YusrApiHelper.Get<InvoiceDto>(`/api/${ this.routeName }/GetReturnInvoiceInitialDetails/${ id }`);
		return {
			...rawResult,
			data: rawResult.data ? this.createEntity(rawResult.data) : undefined
		};
	}

	async ResendEInvoice(invoiceId: number): Promise<RequestResult<EInvoiceStatus>>
	{
		return await YusrApiHelper.Put(
			`/api/${ this.routeName }/ResendEInvoice/${ invoiceId }`
		);
	}
}
