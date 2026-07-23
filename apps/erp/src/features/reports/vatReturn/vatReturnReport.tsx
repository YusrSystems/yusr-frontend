import { ReportContainer } from "@/features/report/reportContainer";
import ReportHeader from "@/features/report/reportHeader";
import { ReportField } from "@/features/report/components/reportField";
import { VatReturnReportTable } from "./vatReturnReportTable";
import { Cubits } from "@/core/services/cubits";
import { useSignals } from "@preact/signals-react/runtime";


interface VatReturnReportProps
{
	isPortal?: boolean;
}

export function VatReturnReport({isPortal = false}: VatReturnReportProps)
{
	useSignals();

	const data = Cubits.VatReturnReport.result.value;

	return (
		<ReportContainer isPortal={ isPortal }>
			<ReportHeader>
				<ReportHeader.CompanySection/>
				<ReportHeader.TitleSection titleAr="الإقرار الضريبي" titleEn="VAT RETURN"/>
				<ReportHeader.MetaDataSection/>
			</ReportHeader>

			{ data && (
				<div className="grid grid-cols-2 gap-3 my-4 print:break-inside-avoid">
					<ReportField labelAr="من التاريخ" labelEn="From date" value={ data.fromDate }/>
					<ReportField labelAr="إلى التاريخ" labelEn="To date" value={ data.toDate }/>
				</div>
			) }

			<VatReturnReportTable/>
		</ReportContainer>
	);
}