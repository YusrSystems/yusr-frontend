import { useEffect } from "react";
import { useSignals } from "@preact/signals-react/runtime";
import { ReportLoading } from "yusr-ui";
import ReportPage from "@/features/report/reportPage.tsx";
import { TaxReturnReportFields } from "@/features/reports/taxReturn/taxReturnReportFields.tsx";
import { TaxReturnReport } from "@/features/reports/taxReturn/taxReturnReport.tsx";
import { Cubits } from "@/core/services/cubits.ts";
import { TaxReturnReportRequest } from "@/features/reports/taxReturn/taxReturnReportRequest.ts";


export function TaxReturnReportPage()
{
	useSignals();

	useEffect(() =>
	{
		void Cubits.TaxReturnReport.getReportData(new TaxReturnReportRequest());
	}, []);

	const isLoading = Cubits.TaxReturnReport.state.value instanceof ReportLoading;

	return (
		<ReportPage>
			<div className="print:hidden w-full shrink-0">
				<TaxReturnReportFields
					onSubmit={ (request) => void Cubits.TaxReturnReport.getReportData(request) }
					isLoading={ isLoading }
				/>
			</div>

			<div className="flex-1 min-h-0 flex flex-col print:block">
				<TaxReturnReport/>
			</div>
		</ReportPage>
	);
}