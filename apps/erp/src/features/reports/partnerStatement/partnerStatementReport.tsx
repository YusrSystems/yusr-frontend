import { ReportContainer } from "@/features/report/reportContainer.tsx";
import ReportHeader from "@/features/report/reportHeader.tsx";
import { ReportPageContainer } from "@/features/report/reportPageContainer.tsx";
import { ReportPageBody } from "@/features/report/reportPageBody.tsx";
import { PartnerStatementReportInfo } from "@/features/reports/partnerStatement/partnerStatementReportInfo.tsx";
import { PartnerStatementReportTable } from "@/features/reports/partnerStatement/partnerStatementReportTable.tsx";
import { Cubits } from "@/core/services/cubits.ts";
import { useSignals } from "@preact/signals-react/runtime";


interface PartnerStatementReportProps
{
	isPortal?: boolean;
}

export function PartnerStatementReport({isPortal = false}: PartnerStatementReportProps)
{
	useSignals();

	const data = Cubits.PartnerStatementReport.result.value;

	return (
		<ReportContainer isPortal={ isPortal }>
			<ReportHeader>
				<ReportHeader.CompanySection/>
				<ReportHeader.TitleSection titleAr="كشف حساب شريك" titleEn="PARTNER STATEMENT">
					{ data && (data.fromDate || data.toDate) && (
						<span className="text-destructive font-bold text-sm">
							{ data.fromDate ? `من ${ data.fromDate } ` : "" }
							{ data.toDate ? `إلى ${ data.toDate }` : "" }
						</span>
					) }
				</ReportHeader.TitleSection>
				<ReportHeader.MetaDataSection/>
			</ReportHeader>

			{ data && <PartnerStatementReportInfo data={ data }/> }

			<ReportPageContainer>
				<ReportPageBody>
					<PartnerStatementReportTable/>
				</ReportPageBody>
			</ReportPageContainer>
		</ReportContainer>
	);
}