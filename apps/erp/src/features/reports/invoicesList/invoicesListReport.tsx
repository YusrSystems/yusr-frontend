import { ReportContainer } from "@/features/report/reportContainer.tsx";
import ReportHeader from "@/features/report/reportHeader.tsx";
import { ReportPageContainer } from "@/features/report/reportPageContainer.tsx";
import { ReportPageBody } from "@/features/report/reportPageBody.tsx";
import { InvoicesListReportTable } from "@/features/reports/invoicesList/invoicesListReportTable.tsx";
import { Services } from "@/core/services/services.ts";
import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources.ts";
import { SystemPermissionsActions, UnauthorizedPage } from "yusr-ui";
import { InvoicesListReportSummary } from "@/features/reports/invoicesList/invoicesListReportSummary.tsx";


interface InvoicesListReportProps
{
	isPortal?: boolean;
}

export function InvoicesListReport({isPortal = false}: InvoicesListReportProps)
{
	if (!Services.auth.hasAuth(
		SystemPermissionsResources.ReportInvoiceList,
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
				<ReportHeader.TitleSection titleAr="قائمة الفواتير" titleEn="Invoices List"/>
				<ReportHeader.MetaDataSection/>
			</ReportHeader>

			<ReportPageContainer>
				<ReportPageBody>
					<InvoicesListReportTable/>
					<InvoicesListReportSummary/>
				</ReportPageBody>
			</ReportPageContainer>
		</ReportContainer>
	);
}