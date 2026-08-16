import { ReportContainer } from "@/features/report/reportContainer.tsx";
import ReportHeader from "@/features/report/reportHeader.tsx";
import { ReportPageContainer } from "@/features/report/reportPageContainer.tsx";
import { ReportPageBody } from "@/features/report/reportPageBody.tsx";
import { ReportField } from "@/features/report/components/reportField.tsx";
import { StockValuationReportTable } from "./stockValuationReportTable.tsx";
import { StockValuationReportSummary } from "./stockValuationReportSummary.tsx";
import { Cubits } from "@/core/services/cubits.ts";
import { useSignals } from "@preact/signals-react/runtime";
import { Services } from "@/core/services/services.ts";
import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources.ts";
import { SystemPermissionsActions, UnauthorizedPage } from "yusr-ui";


interface StockValuationReportProps
{
	isPortal?: boolean;
}

export function StockValuationReport({isPortal = false}: StockValuationReportProps)
{
	useSignals();

	if (!Services.auth.hasAuth(
		SystemPermissionsResources.ReportStockValuation,
		SystemPermissionsActions.Get
	))
	{
		return (
			<ReportContainer isPortal={ isPortal }>
				<div className="min-h-screen flex items-center justify-center">
					<UnauthorizedPage showButtons={ false }/>
				</div>
			</ReportContainer>
		);
	}

	const data = Cubits.stockValuationReport.result.value;

	return (
		<ReportContainer isPortal={ isPortal }>
			<ReportHeader>
				<ReportHeader.CompanySection/>
				<ReportHeader.TitleSection titleAr="تقييم المخزون" titleEn="Stock Valuation"/>
				<ReportHeader.MetaDataSection/>
			</ReportHeader>

			{ data && (
				<div className="grid grid-cols-2 gap-3 my-4 print:break-inside-avoid">
					<ReportField labelAr="إلى تاريخ" labelEn="As of Date" value={ data.asOfDate }/>
				</div>
			) }

			<ReportPageContainer>
				<ReportPageBody>
					<StockValuationReportTable/>
					<StockValuationReportSummary/>
				</ReportPageBody>
			</ReportPageContainer>
		</ReportContainer>
	);
}