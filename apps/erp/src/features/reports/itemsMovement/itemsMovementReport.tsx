import { ReportContainer } from "@/features/report/reportContainer.tsx";
import ReportHeader from "@/features/report/reportHeader.tsx";
import { ReportPageContainer } from "@/features/report/reportPageContainer.tsx";
import { ReportPageBody } from "@/features/report/reportPageBody.tsx";
import { ReportField } from "@/features/report/components/reportField.tsx";
import { ItemsMovementReportTable } from "@/features/reports/itemsMovement/itemsMovementReportTable.tsx";
import { ItemsMovementReportSummary } from "@/features/reports/itemsMovement/itemsMovementReportSummary.tsx";
import { Cubits } from "@/core/services/cubits.ts";
import { useSignals } from "@preact/signals-react/runtime";


interface ItemsMovementReportProps
{
	isPortal?: boolean;
}

export function ItemsMovementReport({isPortal = false}: ItemsMovementReportProps)
{
	useSignals();

	const data = Cubits.ItemsMovementReport.result.value;

	return (
		<ReportContainer isPortal={ isPortal }>
			<ReportHeader>
				<ReportHeader.CompanySection/>
				<ReportHeader.TitleSection
					titleAr="حركة المواد"
					titleEn="ITEMS MOVEMENT"
				/>
				<ReportHeader.MetaDataSection/>
			</ReportHeader>

			{ data && (
				<div className="grid grid-cols-2 gap-3 my-4 print:break-inside-avoid">
					{ data.fromDate && <ReportField labelAr="من التاريخ" labelEn="From date" value={ data.fromDate }/> }
					{ data.toDate && <ReportField labelAr="إلى التاريخ" labelEn="To date" value={ data.toDate }/> }
					{ data.storeName && <ReportField labelAr="المستودع" labelEn="Store" value={ data.storeName }/> }
					{ data.partnerName && <ReportField labelAr="الجهة" labelEn="Partner" value={ data.partnerName }/> }
				</div>
			) }

			<ReportPageContainer>
				<ReportPageBody>
					<ItemsMovementReportTable/>
					<ItemsMovementReportSummary/>
				</ReportPageBody>
			</ReportPageContainer>
		</ReportContainer>
	);
}