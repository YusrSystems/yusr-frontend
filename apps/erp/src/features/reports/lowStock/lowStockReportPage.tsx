import { useEffect, useMemo } from "react";
import { signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import { CrudTablePagination, ReportLoading, SystemPermissionsActions } from "yusr-ui";
import ReportPage from "@/features/report/reportPage.tsx";
import { LowStockReportFields } from "./lowStockReportFields.tsx";
import { LowStockReport } from "./lowStockReport.tsx";
import { LowStockReportRequest } from "./lowStockReportRequest.ts";
import type { LowStockLine } from "./lowStockReportResult.ts";
import { Cubits } from "@/core/services/cubits.ts";
import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources.ts";
import { Services } from "@/core/services/services.ts";
import { APP_NAME } from "../../../../appConfig.ts";


export function LowStockReportPage()
{
	useSignals();

	const lastRequest = useMemo(() => signal(new LowStockReportRequest()), []);

	useEffect(() =>
	{
		if (!Services.auth.hasAuth(SystemPermissionsResources.ReportLowStock, SystemPermissionsActions.Get)) return;
		const initialRequest = new LowStockReportRequest();
		lastRequest.value = initialRequest;
		void Cubits.lowStockReport.getReportData(initialRequest, 1);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleSubmit = (request: LowStockReportRequest) =>
	{
		if (!Services.auth.hasAuth(SystemPermissionsResources.ReportLowStock, SystemPermissionsActions.Get)) return;
		lastRequest.value = request;
		void Cubits.lowStockReport.getReportData(request, 1);
	};

	const handlePageChanged = (newPage: number) =>
	{
		if (!Services.auth.hasAuth(SystemPermissionsResources.ReportLowStock, SystemPermissionsActions.Get)) return;
		void Cubits.lowStockReport.getReportData(lastRequest.value, newPage);
	};

	const isLoading = Cubits.lowStockReport.state.value instanceof ReportLoading;
	const data = Cubits.lowStockReport.result.value;

	useEffect(() =>
	{
		document.title = `تقرير النواقص | ${ APP_NAME }`;
		return () =>
		{
			document.title = APP_NAME;
		};
	}, []);

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
						{header: "الكمية الحالية", accessor: (r) => r.quantityInStock.toString()},
						{header: "الكمية المقترحة للطلب", accessor: (r) => r.suggestedReorderQty.toString()}
					] }
				/>
				<ReportPage.PrintButton/>
			</ReportPage.ActionButtonsContainer>

			<div className="print:hidden w-full shrink-0">
				<LowStockReportFields onSubmit={ handleSubmit } isLoading={ isLoading }/>
			</div>

			<div className="flex-1 min-h-0 flex flex-col print:block">
				<LowStockReport/>
			</div>

			{ data && data.totalCount > 0 && (
				<CrudTablePagination
					className="print:hidden w-full bg-card text-card-foreground border border-t-0 p-4 shadow-sm rounded-b-xl shrink-0"
					pageSize={ data.rowsPerPage }
					totalNumber={ data.totalCount }
					currentPage={ data.pageNumber }
					onPageChanged={ handlePageChanged }
				/>
			) }
		</ReportPage>
	);
}