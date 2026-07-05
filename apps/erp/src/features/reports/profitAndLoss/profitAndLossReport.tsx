import { ReportContainer } from "@/features/report/reportContainer.tsx";
import ReportHeader from "@/features/report/reportHeader.tsx";
import { ReportPageContainer } from "@/features/report/reportPageContainer.tsx";
import { ReportPageBody } from "@/features/report/reportPageBody.tsx";
import { ReportField } from "@/features/report/components/reportField.tsx";
import { ProfitAndLossReportTable } from "@/features/reports/profitAndLoss/profitAndLossReportTable.tsx";
import { ProfitAndLossReportSummary } from "@/features/reports/profitAndLoss/profitAndLossReportSummary.tsx";
import { Cubits } from "@/core/services/cubits.ts";
import { useSignals } from "@preact/signals-react/runtime";


interface ProfitAndLossReportProps
{
	isPortal?: boolean;
}

export function ProfitAndLossReport({isPortal = false}: ProfitAndLossReportProps)
{
	useSignals();

	const data = Cubits.ProfitAndLossReport.result.value;

	return (
		<ReportContainer isPortal={ isPortal }>
			<ReportHeader>
				<ReportHeader.CompanySection/>
				<ReportHeader.TitleSection titleAr="تقرير الأرباح والخسائر" titleEn="PROFIT AND LOSS"/>
				<ReportHeader.MetaDataSection/>
			</ReportHeader>

			{ data && (data.fromDate || data.toDate) && (
				<div className="grid grid-cols-2 gap-3 my-4 print:break-inside-avoid">
					{ data.fromDate && <ReportField labelAr="من التاريخ" labelEn="From date" value={ data.fromDate }/> }
					{ data.toDate && <ReportField labelAr="إلى التاريخ" labelEn="To date" value={ data.toDate }/> }
				</div>
			) }

			<ReportPageContainer>
				<ReportPageBody>
					<ProfitAndLossReportTable/>
					<ProfitAndLossReportSummary/>
				</ReportPageBody>
			</ReportPageContainer>
		</ReportContainer>
	);
}