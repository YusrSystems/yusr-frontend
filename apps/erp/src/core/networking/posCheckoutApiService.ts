import { type RequestResult, YusrApiHelper } from "yusr-ui";
import { PosCheckoutDto } from "../data/posSession";
import type { InvoiceReportResult } from "@/features/reports/invoice/invoiceReportResult.ts";


export default class PosCheckoutApiService
{
	async Checkout(data: PosCheckoutDto): Promise<RequestResult<InvoiceReportResult>>
	{
		return await YusrApiHelper.Post<InvoiceReportResult>(`/api/PosCheckout`, data);
	}
}