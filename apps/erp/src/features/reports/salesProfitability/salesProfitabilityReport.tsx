import { ReportContainer } from "@/features/report/reportContainer";
import ReportHeader from "@/features/report/reportHeader";
import { ReportPageContainer } from "@/features/report/reportPageContainer";
import { ReportPageBody } from "@/features/report/reportPageBody";
import { ReportField } from "@/features/report/components/reportField";
import { SalesProfitabilityReportTable } from "./salesProfitabilityReportTable";
import { SalesProfitabilityReportSummary } from "./salesProfitabilityReportSummary";
import { Cubits } from "@/core/services/cubits";
import { useSignals } from "@preact/signals-react/runtime";


interface SalesProfitabilityReportProps
{
	isPortal?: boolean;
}

export function SalesProfitabilityReport({isPortal = false}: SalesProfitabilityReportProps)
{
	useSignals();

	const data = Cubits.SalesProfitabilityReport.result.value;

	return (
		<ReportContainer isPortal={ isPortal }>
			<ReportHeader>
				<ReportHeader.CompanySection/>
				<ReportHeader.TitleSection
					titleAr="تقرير ربحية المبيعات"
					titleEn="SALES PROFITABILITY"
				/>
				<ReportHeader.MetaDataSection/>
			</ReportHeader>

			{ data && (
				<div className="grid grid-cols-2 gap-3 my-4 print:break-inside-avoid">
					{ data.fromDate && <ReportField labelAr="من التاريخ" labelEn="From date" value={ data.fromDate }/> }
					{ data.toDate && <ReportField labelAr="إلى التاريخ" labelEn="To date" value={ data.toDate }/> }
				</div>
			) }

			<ReportPageContainer>
				<ReportPageBody>
					<SalesProfitabilityReportTable/>
					<SalesProfitabilityReportSummary/>
				</ReportPageBody>
			</ReportPageContainer>
		</ReportContainer>
	);
}