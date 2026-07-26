import { useEffect, useMemo } from "react";
import { signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import { ReportLoading } from "yusr-ui";
import ReportPage from "@/features/report/reportPage.tsx";
import { BalanceSheetReportFields } from "@/features/reports/balanceSheet/balanceSheetReportFields.tsx";
import { BalanceSheetReport } from "@/features/reports/balanceSheet/balanceSheetReport.tsx";
import { Cubits } from "@/core/services/cubits.ts";
import { BalanceSheetReportRequest } from "@/features/reports/balanceSheet/balanceSheetReportRequest.ts";
import { APP_NAME } from "../../../../appConfig.ts";


export function BalanceSheetReportPage()
{
	useSignals();

	const lastRequest = useMemo(() => signal<BalanceSheetReportRequest>(new BalanceSheetReportRequest()), []);

	useEffect(() =>
	{
		void Cubits.BalanceSheetReport.getReportData(lastRequest.value);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleSubmit = (request: BalanceSheetReportRequest) =>
	{
		lastRequest.value = request;
		void Cubits.BalanceSheetReport.getReportData(request);
	};

	useEffect(() =>
	{
		if (lastRequest.value.asOfDate)
		{
			document.title = `الميزانية العمومية - ${ lastRequest.value.asOfDate }`;
		}
		else
		{
			document.title = "الميزانية العمومية";
		}

		return () =>
		{
			document.title = APP_NAME;
		};
	}, [lastRequest.value.asOfDate]);

	const isLoading = Cubits.BalanceSheetReport.state.value instanceof ReportLoading;

	return (
		<ReportPage>
			<ReportPage.ActionButtonsContainer>
				<ReportPage.PrintButton/>
			</ReportPage.ActionButtonsContainer>
			<div className="print:hidden w-full shrink-0">
				<BalanceSheetReportFields onSubmit={ handleSubmit } isLoading={ isLoading }/>
			</div>

			<div className="flex-1 min-h-0 flex flex-col print:block">
				<BalanceSheetReport asOfDate={ lastRequest.value.asOfDate }/>
			</div>
		</ReportPage>
	);
}