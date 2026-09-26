import { PosTerminalDto } from "@/core/data/posTerminal";
import { PosCheckoutDto, type PosSessionCloseDto, PosSessionDto } from "@/core/data/posSession";
import type { SalesInvoiceReportResult } from "@/features/reports/invoice/invoiceReportResult";
import { apiClient, createSimpleListResource } from "#/api";


export const posTerminalsApi = {
	...createSimpleListResource<PosTerminalDto>("PosTerminals"),
	addFavorite: (terminalId: number, itemId: number, displayOrder: number = 0) =>
		apiClient.post<boolean>(
			`/api/PosTerminals/${ terminalId }/Favorites/Add?itemId=${ itemId }&displayOrder=${ displayOrder }`
		),
	removeFavorite: (terminalId: number, itemId: number) =>
		apiClient.delete<boolean>(`/api/PosTerminals/${ terminalId }/Favorites/${ itemId }`)
};

export const posSessionsApi = {
	...createSimpleListResource<PosSessionDto>("PosSessions"),
	getActiveSession: (terminalId: number) =>
		apiClient.get<PosSessionDto | undefined>(`/api/PosSessions/Active/${ terminalId }`, {silent: true}),
	getSummary: (id: number) =>
		apiClient.get<PosSessionDto>(`/api/PosSessions/${ id }/Summary`),
	openSession: (data: Partial<PosSessionDto>) =>
		apiClient.post<PosSessionDto>("/api/PosSessions/Open", data),
	closeSession: (data: PosSessionCloseDto) =>
		apiClient.post<PosSessionDto>("/api/PosSessions/Close", data, {
			successMessage: "تم إغلاق الجلسة بنجاح"
		})
};

export const posCheckoutApi = {
	checkout: (data: PosCheckoutDto) =>
		apiClient.post<SalesInvoiceReportResult>("/api/PosCheckout", data)
};