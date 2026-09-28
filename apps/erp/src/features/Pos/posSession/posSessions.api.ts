import { apiClient, createCrudResource } from "yusr-ui";
import { type PosSessionCloseDto, type PosSessionDto } from "@/core/data/posSession";


export const posSessionsApi = {
	...createCrudResource<PosSessionDto>("PosSessions"),

	getActiveSession: (terminalId: number) =>
		apiClient.get<PosSessionDto>(`/api/PosSessions/Active/${ terminalId }`, {silent: true}),

	getSessionSummary: (id: number) =>
		apiClient.get<PosSessionDto>(`/api/PosSessions/${ id }/Summary`),

	openSession: (data: Partial<PosSessionDto>) =>
		apiClient.post<PosSessionDto>("/api/PosSessions/Open", data),

	closeSession: (data: PosSessionCloseDto) =>
		apiClient.post<PosSessionDto>("/api/PosSessions/Close", data, {
			successMessage: "تم إغلاق الوردية بنجاح"
		})
};