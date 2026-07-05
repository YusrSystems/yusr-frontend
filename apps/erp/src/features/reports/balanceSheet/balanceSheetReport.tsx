import { ReportContainer } from "@/features/report/reportContainer.tsx";
import ReportHeader from "@/features/report/reportHeader.tsx";
import { ReportField } from "@/features/report/components/reportField.tsx";
import { BalanceSheetReportTable } from "@/features/reports/balanceSheet/balanceSheetReportTable.tsx";
import { Cubits } from "@/core/services/cubits.ts";
import { useSignals } from "@preact/signals-react/runtime";


interface BalanceSheetReportProps
{
	toDate: string;
	isPortal?: boolean;
}

export function BalanceSheetReport({toDate, isPortal = false}: BalanceSheetReportProps)
{
	useSignals();

	const data = Cubits.BalanceSheetReport.result.value;

	return (
		<ReportContainer isPortal={ isPortal }>
			<ReportHeader>
				<ReportHeader.CompanySection/>
				<ReportHeader.TitleSection titleAr="الميزانية العمومية" titleEn="BALANCE SHEET"/>
				<ReportHeader.MetaDataSection/>
			</ReportHeader>

			{ data && (
				<div className="grid grid-cols-2 gap-3 my-4 print:break-inside-avoid">
					<ReportField labelAr="إلى التاريخ" labelEn="To date" value={ toDate }/>
				</div>
			) }

			<BalanceSheetReportTable/>
		</ReportContainer>
	);
}