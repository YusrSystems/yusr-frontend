import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import { CrudTablePagination, ReportLoading } from "yusr-ui";
import ReportPage from "@/features/report/reportPage.tsx";
import { ItemStatementReportFields } from "@/features/reports/itemStatement/itemStatementReportFields.tsx";
import { ItemStatementReport } from "@/features/reports/itemStatement/itemStatementReport.tsx";
import { Cubits } from "@/core/services/cubits.ts";
import { ItemStatementReportRequest } from "@/features/reports/itemStatement/itemStatementReportRequest.ts";


export function ItemStatementReportPage()
{
	useSignals();

	const {itemId, itemName} = useParams<{ itemId?: string, itemName?: string }>();
	const lastRequest = useMemo(() => signal<ItemStatementReportRequest | undefined>(undefined), []);

	useEffect(() =>
	{
		const parsedItemId = itemId ? Number(itemId) : undefined;
		if (parsedItemId && !Number.isNaN(parsedItemId))
		{
			const request = new ItemStatementReportRequest({itemId: parsedItemId});
			lastRequest.value = request;
			void Cubits.ItemStatementReport.getReportData(request, 1);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [itemId]);

	const handleSubmit = (request: ItemStatementReportRequest) =>
	{
		lastRequest.value = request;
		void Cubits.ItemStatementReport.getReportData(request, 1);
	};

	const handlePageChanged = (newPage: number) =>
	{
		if (!lastRequest.value) return;
		void Cubits.ItemStatementReport.getReportData(lastRequest.value, newPage);
	};

	const isLoading = Cubits.ItemStatementReport.state.value instanceof ReportLoading;
	const data = Cubits.ItemStatementReport.result.value;

	return (
		<ReportPage>
			<div className="print:hidden w-full shrink-0">
				<ItemStatementReportFields
					onSubmit={ handleSubmit }
					isLoading={ isLoading }
					initialItemId={ itemId ? Number(itemId) : undefined }
					initialItemName={ itemName }
				/>
			</div>

			<div className="flex-1 min-h-0 flex flex-col print:block">
				<ItemStatementReport/>
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