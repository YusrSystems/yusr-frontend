import { useEffect, useMemo } from "react";
import { signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import { ReportLoading } from "yusr-ui";
import ReportPage from "@/features/report/reportPage.tsx";
import { ProfitAndLossReportFields } from "@/features/reports/profitAndLoss/profitAndLossReportFields.tsx";
import { ProfitAndLossReport } from "@/features/reports/profitAndLoss/profitAndLossReport.tsx";
import { Cubits } from "@/core/services/cubits.ts";
import { ProfitAndLossReportRequest } from "@/features/reports/profitAndLoss/profitAndLossReportRequest.ts";


export function ProfitAndLossReportPage()
{
	useSignals();

	const lastRequest = useMemo(() => signal<ProfitAndLossReportRequest>(new ProfitAndLossReportRequest()), []);

	useEffect(() =>
	{
		void Cubits.ProfitAndLossReport.getReportData(lastRequest.value);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleSubmit = (request: ProfitAndLossReportRequest) =>
	{
		lastRequest.value = request;
		void Cubits.ProfitAndLossReport.getReportData(request);
	};

	const isLoading = Cubits.ProfitAndLossReport.state.value instanceof ReportLoading;

	return (
		<ReportPage>
			<ReportPage.ActionButtonsContainer>
				<ReportPage.PrintButton/>
			</ReportPage.ActionButtonsContainer>

			<div className="print:hidden w-full shrink-0">
				<ProfitAndLossReportFields onSubmit={ handleSubmit } isLoading={ isLoading }/>
			</div>

			<div className="flex-1 min-h-0 flex flex-col print:block">
				<ProfitAndLossReport/>
			</div>
		</ReportPage>
	);
}