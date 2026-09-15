import { ReportContainer } from "@/features/report/reportContainer";
import ReportHeader from "@/features/report/reportHeader";
import { ReportPageContainer } from "@/features/report/reportPageContainer";
import { ReportPageBody } from "@/features/report/reportPageBody";
import { ReportField } from "@/features/report/components/reportField";
import { ReceivablesAgingReportTable } from "./receivablesAgingReportTable";
import { ReceivablesAgingReportSummary } from "./receivablesAgingReportSummary";
import { Cubits } from "@/core/services/cubits";
import { useSignals } from "@preact/signals-react/runtime";
import { Services } from "@/core/services/services";
import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources";
import { ReportLoaded, SystemPermissionsActions, UnauthorizedPage } from "yusr-ui";
import { ReceivablesAgingViewMode } from "@/core/types/receivablesAging";


interface ReceivablesAgingReportProps
{
	isPortal?: boolean;
}

export function ReceivablesAgingReport({isPortal = false}: ReceivablesAgingReportProps)
{
	useSignals();
	if (
		!Services.auth.hasAuth(
			SystemPermissionsResources.ReportReceivablesAging,
			SystemPermissionsActions.Get
		)
	)
	{
		return (
			<ReportContainer isPortal={ isPortal }>
				<div className="min-h-screen flex items-center justify-center">
					<UnauthorizedPage showButtons={ false }/>
				</div>
			</ReportContainer>
		);
	}

	const data = Cubits.receivablesAgingReport.result.value;
	const isLoaded = Cubits.receivablesAgingReport.state.value instanceof ReportLoaded;

	return (
		<ReportContainer isPortal={ isPortal }>
			<ReportHeader>
				<ReportHeader.CompanySection/>
				<ReportHeader.TitleSection
					titleAr="تقرير أعمار ديون العملاء"
					titleEn="ACCOUNTS RECEIVABLE AGING"
				/>
				<ReportHeader.MetaDataSection/>
			</ReportHeader>

			{ data && (
				<div className="grid grid-cols-2 gap-3 my-4 print:break-inside-avoid">
					<ReportField labelAr="كما في تاريخ" labelEn="As of date" value={ data.asOfDate }/>
					<ReportField
						labelAr="طريقة العرض"
						labelEn="View Mode"
						value={ data.viewMode === ReceivablesAgingViewMode.Summary ? "ملخص بالعملاء" : "تفصيلي بالفواتير" }
					/>
					{ data.storeName && (
						<ReportField labelAr="المستودع" labelEn="Store" value={ data.storeName }/>
					) }
					{ data.partnerName && (
						<ReportField labelAr="العميل" labelEn="Customer" value={ data.partnerName }/>
					) }
				</div>
			) }

			<ReportPageContainer>
				<ReportPageBody>
					<ReceivablesAgingReportTable/>
					{ isLoaded && data && <ReceivablesAgingReportSummary data={ data }/> }
				</ReportPageBody>
			</ReportPageContainer>
		</ReportContainer>
	);
}