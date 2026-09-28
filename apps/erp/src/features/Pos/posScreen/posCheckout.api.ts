import { apiClient, type ApiResponse } from "yusr-ui";
import { type PosCheckoutDto } from "@/core/data/posSession";
import type { SalesInvoiceReportResult } from "@/features/reports/invoice/invoiceReportResult";


export const posCheckoutApi = {
	checkout: (data: PosCheckoutDto): Promise<ApiResponse<SalesInvoiceReportResult>> =>
		apiClient.post<SalesInvoiceReportResult>("/api/PosCheckout", data)
};