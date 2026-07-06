import { ReportContainer } from "@/features/report/reportContainer.tsx";
import ReportHeader from "@/features/report/reportHeader.tsx";
import { ReportPageContainer } from "@/features/report/reportPageContainer.tsx";
import { ReportPageBody } from "@/features/report/reportPageBody.tsx";
import { AccountStatementReportInfo } from "@/features/reports/accountStatement/accountStatementReportInfo.tsx";
import { AccountStatementReportTable } from "@/features/reports/accountStatement/accountStatementReportTable.tsx";
import { Cubits } from "@/core/services/cubits.ts";
import { useSignals } from "@preact/signals-react/runtime";


interface AccountStatementReportProps
{
	isPortal?: boolean;
}

export function AccountStatementReport({isPortal = false}: AccountStatementReportProps)
{
	useSignals();

	const data = Cubits.AccountStatementReport.result.value;

	return (
		<ReportContainer isPortal={ isPortal }>
			<ReportHeader>
				<ReportHeader.CompanySection/>
				<ReportHeader.TitleSection
					titleAr="كشف حساب"
					titleEn="ACCOUNT STATEMENT"
				>
					{ data && (data.fromDate || data.toDate) && (
						<span className="text-destructive font-bold text-sm">
							{ data.fromDate ? `من ${ data.fromDate } ` : "" }
							{ data.toDate ? `إلى ${ data.toDate }` : "" }
						</span>
					) }
				</ReportHeader.TitleSection>
				<ReportHeader.MetaDataSection/>
			</ReportHeader>

			{ data && <AccountStatementReportInfo data={ data }/> }

			<ReportPageContainer>
				<ReportPageBody>
					<AccountStatementReportTable/>
				</ReportPageBody>
			</ReportPageContainer>
		</ReportContainer>
	);
}