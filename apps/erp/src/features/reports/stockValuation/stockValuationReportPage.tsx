import { useEffect, useMemo } from "react";
import { signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import { CrudTablePagination, ReportLoading } from "yusr-ui";
import ReportPage from "@/features/report/reportPage.tsx";
import { StockValuationReportFields } from "./stockValuationReportFields.tsx";
import { StockValuationReport } from "./stockValuationReport.tsx";
import { StockValuationReportRequest } from "./stockValuationReportRequest.ts";
import type { StockValuationReportResult } from "./stockValuationReportResult.ts";
import { Cubits } from "@/core/services/cubits.ts";
import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources.ts";

export function StockValuationReportPage()
{
	useSignals();
	const state = Cubits.stockValuationReport.state.value;
	const isLoading = state instanceof ReportLoading;
	const reportData = ("data" in state && state.data)
		? (state.data as StockValuationReportResult)
		: null;

	const lastRequest = useMemo(() =>
	{
		const req = new StockValuationReportRequest();
		const params = new URLSearchParams(window.location.search);
		if (params.get("asOfDate")) req.asOfDate = params.get("asOfDate")!;
		return signal(req);
	}, []);

	useEffect(() =>
	{
		void Cubits.stockValuationReport.getReportData(lastRequest.value, 1, 100);
	}, [lastRequest]);

	const handleSubmit = (request: StockValuationReportRequest) =>
	{
		lastRequest.value = request;
		void Cubits.stockValuationReport.getReportData(request, 1, 100);
	};

	const handlePageChanged = (newPage: number) =>
	{
		if (!reportData) return;
		void Cubits.stockValuationReport.getReportData(lastRequest.value, newPage, reportData.rowsPerPage);
	};

	return (
		<ReportPage permissionResource={ SystemPermissionsResources.ReportStockValuation }>
			<StockValuationReportFields onSubmit={ handleSubmit } isLoading={ isLoading }/>
			<div
				className="flex-1 bg-card rounded-lg border border-border shadow-sm overflow-hidden flex flex-col relative min-h-0 mt-4">
				<StockValuationReport/>
			</div>
			{ reportData && (
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