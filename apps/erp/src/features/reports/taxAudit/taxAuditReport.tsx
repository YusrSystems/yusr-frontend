import { ReportContainer } from "@/features/report/reportContainer";
import ReportHeader from "@/features/report/reportHeader";
import { ReportPageContainer } from "@/features/report/reportPageContainer";
import { ReportPageBody } from "@/features/report/reportPageBody";
import { ReportField } from "@/features/report/components/reportField";
import { TaxAuditReportTable } from "./taxAuditReportTable";
import { TaxAuditReportSummary } from "./taxAuditReportSummary";
import { Cubits } from "@/core/services/cubits";
import { useSignals } from "@preact/signals-react/runtime";


interface TaxAuditReportProps
{
	isPortal?: boolean;
}

export function TaxAuditReport({isPortal = false}: TaxAuditReportProps)
{
	useSignals();

	const data = Cubits.TaxAuditReport.result.value;

	return (
		<ReportContainer isPortal={ isPortal }>
			<ReportHeader>
				<ReportHeader.CompanySection/>
				<ReportHeader.TitleSection
					titleAr="تقرير المراجعة الضريبية"
					titleEn="TAX AUDIT REPORT"
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
					<TaxAuditReportTable/>
					<TaxAuditReportSummary/>
				</ReportPageBody>
			</ReportPageContainer>
		</ReportContainer>
	);
}