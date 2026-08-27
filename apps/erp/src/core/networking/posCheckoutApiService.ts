import { type RequestResult, YusrApiHelper } from "yusr-ui";
import { PosCheckoutDto } from "../data/posSession";
import type { SalesInvoiceReportResult } from "@/features/reports/invoice/invoiceReportResult.ts";


export default class PosCheckoutApiService
{
	async Checkout(data: PosCheckoutDto): Promise<RequestResult<SalesInvoiceReportResult>>
	{
		return await YusrApiHelper.Post<SalesInvoiceReportResult>(`/api/PosCheckout`, data);
	}
}