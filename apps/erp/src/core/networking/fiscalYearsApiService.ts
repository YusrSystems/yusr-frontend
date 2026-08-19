import { BaseApiService, type RequestResult, YusrApiHelper } from "yusr-ui";
import {
	CloseFiscalYearDto,
	FiscalPeriodStatusUpdateDto,
	FiscalYearDto,
	FiscalYearStatusUpdateDto,
	ReopenFiscalYearDto,
	YearEndClosingPreviewDto
} from "@/core/data/fiscalYear.ts";


export default class FiscalYearsApiService extends BaseApiService<FiscalYearDto>
{
	constructor()
	{
		super("FiscalYears");
	}

	async ToggleLock(dto: FiscalYearStatusUpdateDto): Promise<RequestResult<FiscalYearDto>>
	{
		return await YusrApiHelper.Put<FiscalYearDto>(`/api/${ this.routeName }/ToggleLock`, dto);
	}

	async GetClosingDiagnostics(id: number): Promise<RequestResult<YearEndClosingPreviewDto>>
	{
		return await YusrApiHelper.Get<YearEndClosingPreviewDto>(`/api/${ this.routeName }/${ id }/ClosingDiagnostics`);
	}

	async CloseYear(dto: CloseFiscalYearDto): Promise<RequestResult<FiscalYearDto>>
	{
		return await YusrApiHelper.Post<FiscalYearDto>(`/api/${ this.routeName }/Close`, dto);
	}

	async ReopenYear(dto: ReopenFiscalYearDto): Promise<RequestResult<FiscalYearDto>>
	{
		return await YusrApiHelper.Post<FiscalYearDto>(`/api/${ this.routeName }/Reopen`, dto);
	}

	async UpdatePeriodStatus(dto: FiscalPeriodStatusUpdateDto): Promise<RequestResult<boolean>>
	{
		return await YusrApiHelper.Put<boolean>(`/api/${ this.routeName }/Periods/Status`, dto);
	}
}
