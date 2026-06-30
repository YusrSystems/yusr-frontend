import ReportPage from "@/features/report/reportPage.tsx";
import { ReportContainer } from "@/features/report/reportContainer.tsx";
import ReportHeader from "@/features/report/reportHeader.tsx";
import { ReportPageContainer } from "@/features/report/reportPageContainer.tsx";
import ReportPageHeader from "@/features/report/reportPageHeader.tsx";
import { ReportPageBody } from "@/features/report/reportPageBody.tsx";
import { ItemsListTableReport } from "@/features/reports/itemsList/itemsListTableReport.tsx";
import { useEffect } from "react";
import { Cubits } from "@/core/services/cubits.ts";
import { Services } from "@/core/services/services.ts";
import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources.ts";
import { SystemPermissionsActions, UnauthorizedPage } from "yusr-ui";


export default function ItemsListReport()
{
	useEffect(() =>
	{
		Cubits.items.init();
	}, []);

	if (!Services.auth.hasAuth(
		SystemPermissionsResources.ReportItemList,
		SystemPermissionsActions.Get
	))
	{
		return (
			<div className="min-h-screen flex items-center justify-center">
				<UnauthorizedPage/>
			</div>
		);
	}

	return (
		<ReportPage>
			<ReportContainer>

				<ReportHeader>
					<ReportHeader.CompanySection/>
					<ReportHeader.TitleSection titleAr="قائمة المواد" titleEn="items list">
					</ReportHeader.TitleSection>
					<ReportHeader.MetaDataSection/>
				</ReportHeader>

				<ReportPageContainer>
					<ReportPageHeader>

					</ReportPageHeader>
					<ReportPageBody>
						<div className="py-2">
							<ItemsListTableReport/>
						</div>
						{/*<ReportInvoiceSummary data={ testSummary }/>*/ }
					</ReportPageBody>

				</ReportPageContainer>
			</ReportContainer>
		</ReportPage>
	);

}