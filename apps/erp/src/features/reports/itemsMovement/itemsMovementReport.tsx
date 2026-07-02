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

	return (
		<ReportContainer isPortal={ isPortal }>
			<ReportHeader>
				<ReportHeader.CompanySection/>
				<ReportHeader.TitleSection
					titleAr={ Cubits.ItemsMovementReport.result.value?.titleAr }
					titleEn={ Cubits.ItemsMovementReport.result.value?.titleEn }
				/>
				<ReportHeader.MetaDataSection/>
			</ReportHeader>

			<div className="grid grid-cols-2 gap-3 my-4 print:break-inside-avoid">
				{ Cubits.ItemsMovementReport.result.value?.itemName &&
                    <ReportField labelAr="المادة" labelEn="Item"
                                 value={ Cubits.ItemsMovementReport.result.value.itemName }/> }
				{ Cubits.ItemsMovementReport.result.value?.fromDate &&
                    <ReportField labelAr="من التاريخ" labelEn="From date"
                                 value={ Cubits.ItemsMovementReport.result.value.fromDate }/> }
				{ Cubits.ItemsMovementReport.result.value?.toDate &&
                    <ReportField labelAr="إلى التاريخ" labelEn="To date"
                                 value={ Cubits.ItemsMovementReport.result.value.toDate }/> }
				{ Cubits.ItemsMovementReport.result.value?.fromAccount &&
                    <ReportField labelAr="من الحساب" labelEn="From account"
                                 value={ Cubits.ItemsMovementReport.result.value.fromAccount }/> }
				{ Cubits.ItemsMovementReport.result.value?.toAccount &&
                    <ReportField labelAr="إلى الحساب" labelEn="To account"
                                 value={ Cubits.ItemsMovementReport.result.value.toAccount }/> }
				{ Cubits.ItemsMovementReport.result.value?.fromStore &&
                    <ReportField labelAr="من المستودع" labelEn="From store"
                                 value={ Cubits.ItemsMovementReport.result.value.fromStore }/> }
				{ Cubits.ItemsMovementReport.result.value?.toStore &&
                    <ReportField labelAr="إلى المستودع" labelEn="To store"
                                 value={ Cubits.ItemsMovementReport.result.value.toStore }/> }
			</div>

			<ReportPageContainer>
				<ReportPageBody>
					<ItemsMovementReportTable/>
					<ItemsMovementReportSummary/>
				</ReportPageBody>
			</ReportPageContainer>
		</ReportContainer>
	);
}