import { ReportContainer } from "@/features/report/reportContainer.tsx";
import ReportHeader from "@/features/report/reportHeader.tsx";
import { ReportPageContainer } from "@/features/report/reportPageContainer.tsx";
import { ReportPageBody } from "@/features/report/reportPageBody.tsx";
import { ReportField } from "@/features/report/components/reportField.tsx";
import { ItemsTaxStatementReportTable } from "@/features/reports/itemsTaxStatement/itemsTaxStatementReportTable.tsx";
import {
	ItemsTaxStatementReportSummary
} from "@/features/reports/itemsTaxStatement/itemsTaxStatementReportSummary.tsx";
import { Cubits } from "@/core/services/cubits.ts";
import { useSignals } from "@preact/signals-react/runtime";


interface ItemsTaxStatementReportProps
{
	isPortal?: boolean;
}

export function ItemsTaxStatementReport({isPortal = false}: ItemsTaxStatementReportProps)
{
	useSignals();

	const data = Cubits.ItemsTaxStatementReport.result.value;

	return (
		<ReportContainer isPortal={ isPortal }>
			<ReportHeader>
				<ReportHeader.CompanySection/>
				<ReportHeader.TitleSection titleAr="كشف الضريبة" titleEn="TAX STATEMENT"/>
				<ReportHeader.MetaDataSection/>
			</ReportHeader>

			{ data && (data.fromDate || data.toDate) && (
				<div className="grid grid-cols-2 gap-3 my-4 print:break-inside-avoid">
					{ data.fromDate && <ReportField labelAr="من الفترة" labelEn="From date" value={ data.fromDate }/> }
					{ data.toDate && <ReportField labelAr="إلى الفترة" labelEn="To date" value={ data.toDate }/> }
				</div>
			) }

			<ReportPageContainer>
				<ReportPageBody>
					<ItemsTaxStatementReportTable/>
					<ItemsTaxStatementReportSummary/>
				</ReportPageBody>
			</ReportPageContainer>
		</ReportContainer>
	);
}