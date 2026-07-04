import { ReportContainer } from "@/features/report/reportContainer.tsx";
import ReportHeader from "@/features/report/reportHeader.tsx";
import { ReportField } from "@/features/report/components/reportField.tsx";
import { TaxReturnReportTable } from "@/features/reports/taxReturn/taxReturnReportTable.tsx";
import { Cubits } from "@/core/services/cubits.ts";
import { useSignals } from "@preact/signals-react/runtime";


interface TaxReturnReportProps
{
	isPortal?: boolean;
}

export function TaxReturnReport({isPortal = false}: TaxReturnReportProps)
{
	useSignals();

	const data = Cubits.TaxReturnReport.result.value;

	return (
		<ReportContainer isPortal={ isPortal }>
			<ReportHeader>
				<ReportHeader.CompanySection/>
				<ReportHeader.TitleSection titleAr="الإقرار الضريبي" titleEn="TAX RETURN"/>
				<ReportHeader.MetaDataSection/>
			</ReportHeader>

			{ data && (
				<div className="grid grid-cols-2 gap-3 my-4 print:break-inside-avoid">
					<ReportField labelAr="من التاريخ" labelEn="From date" value={ data.fromDate }/>
					<ReportField labelAr="إلى التاريخ" labelEn="To date" value={ data.toDate }/>
				</div>
			) }

			<TaxReturnReportTable/>
		</ReportContainer>
	);
}