import {
	CloseFiscalYearDto,
	FiscalPeriodDto,
	FiscalPeriodStatusUpdateDto,
	FiscalYearDto,
	FiscalYearStatusUpdateDto,
	ReopenFiscalYearDto,
	YearEndClosingPreviewDto
} from "@/core/data/fiscalYear";
import { apiClient, createSimpleListResource } from "#/api";


export const fiscalYearsApi = {
	...createSimpleListResource<FiscalYearDto>("FiscalYears"),
	toggleLock: (dto: FiscalYearStatusUpdateDto) =>
		apiClient.put<FiscalYearDto>("/api/FiscalYears/ToggleLock", dto),
	getClosingDiagnostics: (id: number) =>
		apiClient.get<YearEndClosingPreviewDto>(`/api/FiscalYears/${ id }/ClosingDiagnostics`),
	closeYear: (dto: CloseFiscalYearDto) =>
		apiClient.post<FiscalYearDto>("/api/FiscalYears/Close", dto, {
			successMessage: "تم إقفال السنة المالية بنجاح"
		}),
	reopenYear: (dto: ReopenFiscalYearDto) =>
		apiClient.post<FiscalYearDto>("/api/FiscalYears/Reopen", dto, {
			successMessage: "تمت إعادة فتح السنة المالية بنجاح"
		}),
	updatePeriodStatus: (dto: FiscalPeriodStatusUpdateDto) =>
		apiClient.put<FiscalPeriodDto>("/api/FiscalYears/Periods/Status", dto)
};