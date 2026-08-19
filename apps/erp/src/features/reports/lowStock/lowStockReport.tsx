import { ReportContainer } from "@/features/report/reportContainer.tsx";
import ReportHeader from "@/features/report/reportHeader.tsx";
import { ReportPageContainer } from "@/features/report/reportPageContainer.tsx";
import { ReportPageBody } from "@/features/report/reportPageBody.tsx";
import { ReportField } from "@/features/report/components/reportField.tsx";
import { LowStockReportTable } from "./lowStockReportTable.tsx";
import { Cubits } from "@/core/services/cubits.ts";
import { useSignals } from "@preact/signals-react/runtime";
import { Services } from "@/core/services/services.ts";
import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources.ts";
import { SystemPermissionsActions, UnauthorizedPage } from "yusr-ui";


interface LowStockReportProps
{
	isPortal?: boolean;
}

export function LowStockReport({isPortal = false}: LowStockReportProps)
{
	useSignals();

	if (!Services.auth.hasAuth(
		SystemPermissionsResources.ReportLowStock,
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

	const data = Cubits.lowStockReport.result.value;

	return (
		<ReportContainer isPortal={ isPortal }>
			<ReportHeader>
				<ReportHeader.CompanySection/>
				<ReportHeader.TitleSection titleAr="تقرير النواقص" titleEn="Low Stock"/>
				<ReportHeader.MetaDataSection/>
			</ReportHeader>

			{ data && (
				<div className="grid grid-cols-2 gap-3 my-4 print:break-inside-avoid">
					<ReportField labelAr="المستودع" labelEn="Store" value={ data.storeName || "الكل (All)" }/>
				</div>
			) }

			<ReportPageContainer>
				<ReportPageBody>
					<LowStockReportTable/>
				</ReportPageBody>
			</ReportPageContainer>
		</ReportContainer>
	);
}