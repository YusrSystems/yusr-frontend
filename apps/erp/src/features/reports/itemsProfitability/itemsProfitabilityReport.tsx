import { ReportContainer } from "@/features/report/reportContainer";
import ReportHeader from "@/features/report/reportHeader";
import { ReportPageContainer } from "@/features/report/reportPageContainer";
import { ReportPageBody } from "@/features/report/reportPageBody";
import { ReportField } from "@/features/report/components/reportField";
import { ItemsProfitabilityReportTable } from "./itemsProfitabilityReportTable";
import { ItemsProfitabilityReportSummary } from "./itemsProfitabilityReportSummary";
import { Cubits } from "@/core/services/cubits";
import { useSignals } from "@preact/signals-react/runtime";
import { Services } from "@/core/services/services";
import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources";
import { SystemPermissionsActions, UnauthorizedPage } from "yusr-ui";


interface ItemsProfitabilityReportProps
{
	isPortal?: boolean;
}

export function ItemsProfitabilityReport({isPortal = false}: ItemsProfitabilityReportProps)
{
	useSignals();

	if (!Services.auth.hasAuth(
		SystemPermissionsResources.ReportItemsProfitability,
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

	const data = Cubits.ItemsProfitabilityReport.result.value;

	return (
		<ReportContainer isPortal={ isPortal }>
			<ReportHeader>
				<ReportHeader.CompanySection/>
				<ReportHeader.TitleSection
					titleAr="تقرير ربحية المواد"
					titleEn="ITEMS PROFITABILITY"
				/>
				<ReportHeader.MetaDataSection/>
			</ReportHeader>
			{ data && (
				<div className="grid grid-cols-2 gap-3 my-4 print:break-inside-avoid">
					{ data.fromDate && <ReportField labelAr="من التاريخ" labelEn="From date" value={ data.fromDate }/> }
					{ data.toDate && <ReportField labelAr="إلى التاريخ" labelEn="To date" value={ data.toDate }/> }
				</div>
			) }
			<ReportPageContainer>
				<ReportPageBody>
					<ItemsProfitabilityReportTable/>
					<ItemsProfitabilityReportSummary/>
				</ReportPageBody>
			</ReportPageContainer>
		</ReportContainer>
	);
}