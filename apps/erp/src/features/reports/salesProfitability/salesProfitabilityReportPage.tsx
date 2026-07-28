import { useEffect, useMemo } from "react";
import { signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import { CrudTablePagination, ReportLoading, SystemPermissionsActions } from "yusr-ui";
import ReportPage from "@/features/report/reportPage";
import { SalesProfitabilityReportFields } from "./salesProfitabilityReportFields";
import { SalesProfitabilityReport } from "./salesProfitabilityReport";
import { SalesProfitabilityReportRequest } from "./salesProfitabilityReportRequest";
import { Cubits } from "@/core/services/cubits";
import type { SalesProfitabilityLine } from "./salesProfitabilityReportResult";
import { getProfitAndLossRowDocumentTypeName } from "./salesProfitabilityReportTable";
import { useTranslation } from "react-i18next";
import { APP_NAME } from "../../../../appConfig.ts";
import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources.ts";
import { Services } from "@/core/services/services.ts";


export function SalesProfitabilityReportPage()
{
	useSignals();
	const {t} = useTranslation("accounting");

	const lastRequest = useMemo(() => signal<SalesProfitabilityReportRequest>(new SalesProfitabilityReportRequest()), []);

	useEffect(() =>
	{
		if (!Services.auth.hasAuth(SystemPermissionsResources.ReportSalesProfitability, SystemPermissionsActions.Get)) return;
		void Cubits.SalesProfitabilityReport.getReportData(lastRequest.value, 1);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleSubmit = (request: SalesProfitabilityReportRequest) =>
	{
		if (!Services.auth.hasAuth(SystemPermissionsResources.ReportSalesProfitability, SystemPermissionsActions.Get)) return;
		lastRequest.value = request;
		void Cubits.SalesProfitabilityReport.getReportData(request, 1);
	};

	const handlePageChanged = (newPage: number) =>
	{
		if (!Services.auth.hasAuth(SystemPermissionsResources.ReportSalesProfitability, SystemPermissionsActions.Get)) return;
		void Cubits.SalesProfitabilityReport.getReportData(lastRequest.value, newPage);
	};

	const isLoading = Cubits.SalesProfitabilityReport.state.value instanceof ReportLoading;

	const data = Cubits.SalesProfitabilityReport.result.value;

	useEffect(() =>
	{
		if (data && lastRequest.value.fromDate && lastRequest.value.toDate)
		{
			document.title = `تقرير ربحية المبيعات - من ${ lastRequest.value.fromDate } إلى ${ lastRequest.value.toDate }`;
		}
		else
		{
			document.title = "تقرير ربحية المبيعات";
		}

		return () =>
		{
			document.title = APP_NAME;
		};
	}, [data, lastRequest.value.fromDate, lastRequest.value.toDate]);

	return (
		<ReportPage permissionResource={ SystemPermissionsResources.ReportSalesProfitability }>
			<ReportPage.ActionButtonsContainer>
				<ReportPage.ExcelButton<SalesProfitabilityLine>
					fileName="تقرير_ربحية_المبيعات"
					getRows={ async () => Cubits.SalesProfitabilityReport.result.value?.lines ?? [] }
					columns={ [
						{header: "التاريخ", accessor: (r) => r.date},
						{
							header: "نوع المستند",
							accessor: (r) => getProfitAndLossRowDocumentTypeName(r.documentType, t)
						},
						{header: "رقم المستند", accessor: (r) => r.documentId.toString()},
						{header: "الجهة", accessor: (r) => r.partnerName ?? ""},
						{header: "الحساب", accessor: (r) => r.glAccountName ?? ""},
						{header: "البيان", accessor: (r) => r.description ?? ""},
						{header: "المبيعات", accessor: (r) => r.salesAmount.toString()},
						{header: "التكلفة", accessor: (r) => r.cogsAmount.toString()},
						{header: "تكاليف مباشرة", accessor: (r) => r.directCostsAmount.toString()},
						{header: "صافي الربح", accessor: (r) => r.netProfit.toString()}
					] }
				/>
				<ReportPage.PrintButton/>
			</ReportPage.ActionButtonsContainer>

			<div className="print:hidden w-full shrink-0">
				<SalesProfitabilityReportFields onSubmit={ handleSubmit } isLoading={ isLoading }/>
			</div>

			<div className="flex-1 min-h-0 flex flex-col print:block">
				<SalesProfitabilityReport/>
			</div>

			{ Cubits.SalesProfitabilityReport.result.value && Cubits.SalesProfitabilityReport.result.value.totalCount > 0 && (
				<CrudTablePagination
					className="print:hidden w-full bg-card text-card-foreground border border-t-0 p-4 shadow-sm rounded-b-xl shrink-0"
					pageSize={ Cubits.SalesProfitabilityReport.result.value.rowsPerPage }
					totalNumber={ Cubits.SalesProfitabilityReport.result.value.totalCount }
					currentPage={ Cubits.SalesProfitabilityReport.result.value.pageNumber }
					onPageChanged={ handlePageChanged }
				/>
			) }
		</ReportPage>
	);
}