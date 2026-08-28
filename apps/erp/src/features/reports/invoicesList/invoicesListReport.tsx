import { ReportContainer } from "@/features/report/reportContainer";
import ReportHeader from "@/features/report/reportHeader";
import { ReportPageContainer } from "@/features/report/reportPageContainer";
import { ReportPageBody } from "@/features/report/reportPageBody";
import { InvoicesListReportTable } from "@/features/reports/invoicesList/invoicesListReportTable";
import { InvoicesListReportSummary } from "@/features/reports/invoicesList/invoicesListReportSummary";
import { Services } from "@/core/services/services";
import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources";
import { PageCubit, SystemPermissionsActions, UnauthorizedPage } from "yusr-ui";
import type { ICommercialInvoiceDocumentDto } from "@/core/data/commercial/commercialInvoiceDocument";


export interface InvoicesListReportProps<
	TInvoiceDto extends ICommercialInvoiceDocumentDto & { type: number }
>
{
	cubit: PageCubit<TInvoiceDto>;
	getTypeName: (type: TInvoiceDto["type"]) => string;
	titleAr?: string;
	titleEn?: string;
	routePrefix?: string;
	isPortal?: boolean;
}

export function InvoicesListReport<
	TInvoiceDto extends ICommercialInvoiceDocumentDto & { type: number }
>({
	cubit,
	getTypeName,
	titleAr = "قائمة الفواتير",
	titleEn = "Invoices List",
	routePrefix = "sales",
	isPortal = false
}: InvoicesListReportProps<TInvoiceDto>)
{
	if (
		!Services.auth.hasAuth(
			SystemPermissionsResources.ReportInvoiceList,
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

	return (
		<ReportContainer isPortal={ isPortal }>
			<ReportHeader>
				<ReportHeader.CompanySection/>
				<ReportHeader.TitleSection titleAr={ titleAr } titleEn={ titleEn }/>
				<ReportHeader.MetaDataSection/>
			</ReportHeader>

			<ReportPageContainer>
				<ReportPageBody>
					<InvoicesListReportTable<TInvoiceDto>
						cubit={ cubit }
						getTypeName={ getTypeName }
						routePrefix={ routePrefix }
					/>
					<InvoicesListReportSummary invoices={ cubit.entities.value }/>
				</ReportPageBody>
			</ReportPageContainer>
		</ReportContainer>
	);
}