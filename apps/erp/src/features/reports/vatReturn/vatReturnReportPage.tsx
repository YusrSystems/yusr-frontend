import { useEffect } from "react";
import { useSignals } from "@preact/signals-react/runtime";
import { ReportLoading, SystemPermissionsActions } from "yusr-ui";
import ReportPage from "@/features/report/reportPage";
import { VatReturnReportFields } from "./vatReturnReportFields";
import { VatReturnReport } from "./vatReturnReport";
import { Cubits } from "@/core/services/cubits";
import { VatReturnReportRequest } from "./vatReturnReportRequest";
import { APP_NAME } from "../../../../appConfig.ts";
import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources.ts";
import { Services } from "@/core/services/services.ts";


export function VatReturnReportPage()
{
	useSignals();

	useEffect(() =>
	{
		if (!Services.auth.hasAuth(SystemPermissionsResources.ReportVatReturn, SystemPermissionsActions.Get)) return;
		void Cubits.VatReturnReport.getReportData(new VatReturnReportRequest());
	}, []);

	const isLoading = Cubits.VatReturnReport.state.value instanceof ReportLoading;

	const data = Cubits.VatReturnReport.result.value;

	useEffect(() =>
	{
		if (data && data.fromDate && data.toDate)
		{
			document.title = `إقرار ضريبة القيمة المضافة - من ${ data.fromDate } إلى ${ data.toDate }`;
		}
		else
		{
			document.title = "إقرار ضريبة القيمة المضافة";
		}

		return () =>
		{
			document.title = APP_NAME;
		};
	}, [data, data?.fromDate, data?.toDate]);

	return (
		<ReportPage permissionResource={ SystemPermissionsResources.ReportVatReturn }>
			<ReportPage.ActionButtonsContainer>
				<ReportPage.PrintButton/>
			</ReportPage.ActionButtonsContainer>
			<div className="print:hidden w-full shrink-0">
				<VatReturnReportFields
					onSubmit={ (request) =>
					{
						if (!Services.auth.hasAuth(SystemPermissionsResources.ReportVatReturn, SystemPermissionsActions.Get)) return;
						void Cubits.VatReturnReport.getReportData(request);
					} }
					isLoading={ isLoading }
				/>
			</div>

			<div className="flex-1 min-h-0 flex flex-col print:block">
				<VatReturnReport/>
			</div>
		</ReportPage>
	);
}