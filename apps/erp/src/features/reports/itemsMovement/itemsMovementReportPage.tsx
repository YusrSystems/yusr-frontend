import { useEffect, useMemo } from "react";
import { signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import { CrudTablePagination, ReportLoading } from "yusr-ui";
import ReportPage from "@/features/report/reportPage.tsx";
import { ItemsMovementReportFields } from "@/features/reports/itemsMovement/itemsMovementReportFields.tsx";
import { ItemsMovementReport } from "@/features/reports/itemsMovement/itemsMovementReport.tsx";
import { ItemsMovementReportRequest } from "@/core/data/report/itemsMovementReportRequest.ts";
import { Cubits } from "@/core/services/cubits.ts";


export function ItemsMovementReportPage()
{
	useSignals();

	// Remembers the last SUBMITTED filters so a page-change click can re-run
	// the same query with just a different page number, without needing the
	// form re-submitted.
	const lastRequest = useMemo(() => signal<ItemsMovementReportRequest>(new ItemsMovementReportRequest()), []);

	useEffect(() =>
	{
		void Cubits.ItemsMovementReport.getReportData(lastRequest.value, 1);
	}, []);

	const handleSubmit = (request: ItemsMovementReportRequest) =>
	{
		lastRequest.value = request;
		void Cubits.ItemsMovementReport.getReportData(request, 1);
	};

	const handlePageChanged = (newPage: number) =>
	{
		void Cubits.ItemsMovementReport.getReportData(lastRequest.value, newPage);
	};

	const isLoading = Cubits.ItemsMovementReport.state.value instanceof ReportLoading;

	return (
		<ReportPage>
			<div className="print:hidden w-full shrink-0">
				<ItemsMovementReportFields onSubmit={ handleSubmit } isLoading={ isLoading }/>
			</div>

			<div className="flex-1 min-h-0 flex flex-col print:block">
				<ItemsMovementReport/>
			</div>

			{ Cubits.ItemsMovementReport.result.value && (
				<CrudTablePagination
					className="print:hidden w-full bg-card text-card-foreground border border-t-0 p-4 shadow-sm rounded-b-xl shrink-0"
					pageSize={ Cubits.ItemsMovementReport.result.value.rowsPerPage }
					totalNumber={ Cubits.ItemsMovementReport.result.value.totalCount }
					currentPage={ Cubits.ItemsMovementReport.result.value.pageNumber }
					onPageChanged={ handlePageChanged }
				/>
			) }
		</ReportPage>
	);
}