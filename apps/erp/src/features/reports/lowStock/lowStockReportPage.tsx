import { useEffect, useMemo } from "react";
import { signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import { CrudTablePagination, ReportLoading } from "yusr-ui";
import ReportPage from "@/features/report/reportPage.tsx";
import { LowStockReportFields } from "./lowStockReportFields.tsx";
import { LowStockReport } from "./lowStockReport.tsx";
import { LowStockReportRequest } from "./lowStockReportRequest.ts";
import type { LowStockLine, LowStockReportResult } from "./lowStockReportResult.ts";
import { Cubits } from "@/core/services/cubits.ts";
import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources.ts";
import { useTranslation } from "react-i18next";
import { APP_NAME } from "../../../../appConfig.ts";


export function LowStockReportPage()
{
	useSignals();
	const {t} = useTranslation("erpCommon");
	const state = Cubits.lowStockReport.state.value;
	const isLoading = state instanceof ReportLoading;

	const reportData = ("data" in state && state.data)
		? (state.data as LowStockReportResult)
		: null;

	const lastRequest = useMemo(() => signal(new LowStockReportRequest()), []);

	useEffect(() =>
	{
		const initialRequest = new LowStockReportRequest();
		lastRequest.value = initialRequest;
		void Cubits.lowStockReport.getReportData(initialRequest, 1, 100);
	}, [lastRequest]);

	const handleSubmit = (request: LowStockReportRequest) =>
	{
		lastRequest.value = request;
		void Cubits.lowStockReport.getReportData(request, 1, 100);
	};

	const handlePageChanged = (newPage: number) =>
	{
		if (!reportData) return;
		void Cubits.lowStockReport.getReportData(lastRequest.value, newPage, reportData.rowsPerPage);
	};

	useEffect(() =>
	{
		document.title = `${ t("reports.lowStock", "تقرير النواقص") } | ${ APP_NAME }`;
		return () =>
		{
			document.title = APP_NAME;
		};
	}, [t]);

	return (
		<ReportPage permissionResource={ SystemPermissionsResources.ReportLowStock }>
			<ReportPage.ActionButtonsContainer>
				<ReportPage.ExcelButton<LowStockLine>
					fileName="تقرير_النواقص"
					getRows={ async () => Cubits.lowStockReport.result.value?.lines ?? [] }
					columns={ [
						{header: "رقم المادة", accessor: (r) => r.itemId},
						{header: "اسم المادة", accessor: (r) => r.itemName},
						{header: "الوحدة", accessor: (r) => r.baseUnitName},
						{header: "الحد الأدنى", accessor: (r) => r.minQuantityLimit ?? ""},
						{header: "الحد الأعلى", accessor: (r) => r.maxQuantityLimit ?? ""},
						{header: "الكمية الحالية", accessor: (r) => r.quantityInStock},
						{header: "الكمية المقترحة للطلب", accessor: (r) => r.suggestedReorderQty}
					] }
				/>
				<ReportPage.PrintButton/>
			</ReportPage.ActionButtonsContainer>

			<LowStockReportFields onSubmit={ handleSubmit } isLoading={ isLoading }/>

			<div
				className="flex-1 bg-card rounded-lg border border-border shadow-sm overflow-hidden flex flex-col relative min-h-0 mt-4">
				<LowStockReport/>
			</div>

			{ reportData && reportData.totalCount > 0 && (
				<div className="mt-4 flex justify-end">
					<CrudTablePagination
						pageSize={ reportData.rowsPerPage }
						totalNumber={ reportData.totalCount }
						currentPage={ reportData.pageNumber }
						onPageChanged={ handlePageChanged }
					/>
				</div>
			) }
		</ReportPage>
	);
}