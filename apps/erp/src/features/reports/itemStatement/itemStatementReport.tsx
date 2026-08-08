import { ReportContainer } from "@/features/report/reportContainer.tsx";
import ReportHeader from "@/features/report/reportHeader.tsx";
import { ReportPageContainer } from "@/features/report/reportPageContainer.tsx";
import { ReportPageBody } from "@/features/report/reportPageBody.tsx";
import { ItemStatementReportInfo } from "@/features/reports/itemStatement/itemStatementReportInfo.tsx";
import { ItemStatementReportTable } from "@/features/reports/itemStatement/itemStatementReportTable.tsx";
import { Cubits } from "@/core/services/cubits.ts";
import { useSignals } from "@preact/signals-react/runtime";


interface ItemStatementReportProps
{
	isPortal?: boolean;
}

export function ItemStatementReport({isPortal = false}: ItemStatementReportProps)
{
	useSignals();

	const data = Cubits.ItemStatementReport.result.value;

	return (
		<ReportContainer isPortal={ isPortal }>
			<ReportHeader>
				<ReportHeader.CompanySection/>
				<ReportHeader.TitleSection
					titleAr="كشف مادة"
					titleEn="ITEM STATEMENT"
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

			{ data && <ItemStatementReportInfo data={ data }/> }

			<ReportPageContainer>
				<ReportPageBody>
					<ItemStatementReportTable/>
				</ReportPageBody>
			</ReportPageContainer>
		</ReportContainer>
	);
}