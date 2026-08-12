import { type RequestResult, YusrApiHelper } from "yusr-ui";
import { PosCheckoutDto } from "../data/posSession";
import { InvoiceDto } from "../data/invoices/invoice";


export default class PosCheckoutApiService
{
	async Checkout(data: PosCheckoutDto): Promise<RequestResult<InvoiceDto>>
	{
		return await YusrApiHelper.Post<InvoiceDto>(`/api/PosCheckout`, data);
	}
}