import { ReportContainer } from "@/features/report/reportContainer.tsx";
import ReportHeader from "@/features/report/reportHeader.tsx";
import { ReportPageContainer } from "@/features/report/reportPageContainer.tsx";
import { ReportPageBody } from "@/features/report/reportPageBody.tsx";
import { Services } from "@/core/services/services.ts";
import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources.ts";
import { SystemPermissionsActions, UnauthorizedPage } from "yusr-ui";
import { VouchersListReportTable } from "@/features/reports/vouchersList/vouchersListReportTable.tsx";
import { VouchersListReportSummary } from "@/features/reports/vouchersList/vouchersListReportSummary.tsx";


interface VouchersListReportProps
{
	isPortal?: boolean;
}

export function VouchersListReport({isPortal = false}: VouchersListReportProps)
{
	if (!Services.auth.hasAuth(
		SystemPermissionsResources.ReportVoucherList,
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
				<ReportHeader.TitleSection titleAr="قائمة السندات" titleEn="vouchers list"/>
				<ReportHeader.MetaDataSection/>
			</ReportHeader>
			<ReportPageContainer>
				<ReportPageBody>
					<VouchersListReportTable/>
					<VouchersListReportSummary/>
				</ReportPageBody>
			</ReportPageContainer>
		</ReportContainer>
	);
}