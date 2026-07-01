import { ReportContainer } from "@/features/report/reportContainer.tsx";
import ReportHeader from "@/features/report/reportHeader.tsx";
import { ReportPageContainer } from "@/features/report/reportPageContainer.tsx";
import { ReportPageBody } from "@/features/report/reportPageBody.tsx";
import { ItemsListReportTable } from "@/features/reports/itemsList/itemsListReportTable.tsx";
import { Services } from "@/core/services/services.ts";
import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources.ts";
import { SystemPermissionsActions, UnauthorizedPage } from "yusr-ui";
import { ItemsListReportSummary } from "@/features/reports/itemsList/itemsListReportSummary.tsx";


interface ItemsListReportProps
{
	isPortal?: boolean;
}

export function ItemsListReport({isPortal = false}: ItemsListReportProps)
{
	if (!Services.auth.hasAuth(
		SystemPermissionsResources.ReportItemList,
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

	return (
		<ReportContainer isPortal={ isPortal }>
			<ReportHeader>
				<ReportHeader.CompanySection/>
				<ReportHeader.TitleSection titleAr="قائمة المواد" titleEn="items list"/>
				<ReportHeader.MetaDataSection/>
			</ReportHeader>

			<ReportPageContainer>
				<ReportPageBody>
					<ItemsListReportTable/>
					<ItemsListReportSummary/>
				</ReportPageBody>
			</ReportPageContainer>
		</ReportContainer>
	);
}