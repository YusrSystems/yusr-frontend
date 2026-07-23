import { useEffect } from "react";
import { useSignals } from "@preact/signals-react/runtime";
import { ReportLoading } from "yusr-ui";
import ReportPage from "@/features/report/reportPage";
import { VatReturnReportFields } from "./vatReturnReportFields";
import { VatReturnReport } from "./vatReturnReport";
import { Cubits } from "@/core/services/cubits";
import { VatReturnReportRequest } from "./vatReturnReportRequest";


export function VatReturnReportPage()
{
	useSignals();

	useEffect(() =>
	{
		void Cubits.VatReturnReport.getReportData(new VatReturnReportRequest());
	}, []);

	const isLoading = Cubits.VatReturnReport.state.value instanceof ReportLoading;

	return (
		<ReportPage>
			<ReportPage.ActionButtonsContainer>
				<ReportPage.PrintButton/>
			</ReportPage.ActionButtonsContainer>
			<div className="print:hidden w-full shrink-0">
				<VatReturnReportFields
					onSubmit={ (request) => void Cubits.VatReturnReport.getReportData(request) }
					isLoading={ isLoading }
				/>
			</div>

			<div className="flex-1 min-h-0 flex flex-col print:block">
				<VatReturnReport/>
			</div>
		</ReportPage>
	);
}