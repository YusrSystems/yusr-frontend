import { ReportContainer } from "@/features/report/reportContainer.tsx";
import ReportHeader from "@/features/report/reportHeader.tsx";
import { ReportPageContainer } from "@/features/report/reportPageContainer.tsx";
import { ReportPageBody } from "@/features/report/reportPageBody.tsx";
import { Services } from "@/core/services/services.ts";
import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources.ts";
import { SystemPermissionsActions, UnauthorizedPage } from "yusr-ui";
import { AccountsListReportTable } from "@/features/reports/accountsList/accountsListReportTable.tsx";


interface AccountsListReportProps
{
	isPortal?: boolean;
}

export function AccountsListReport({isPortal = false}: AccountsListReportProps)
{
	if (!Services.auth.hasAuth(
		SystemPermissionsResources.ReportAccountList,
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
				<ReportHeader.TitleSection titleAr="قائمة الحسابات" titleEn="accounts list"/>
				<ReportHeader.MetaDataSection/>
			</ReportHeader>

			<ReportPageContainer>
				<ReportPageBody>
					<AccountsListReportTable/>
				</ReportPageBody>
			</ReportPageContainer>
		</ReportContainer>
	);
}