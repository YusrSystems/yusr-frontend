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
import type { ItemStatementLine } from "@/features/reports/itemStatement/itemStatementReportResult.ts";
import { APP_NAME } from "../../../../appConfig.ts";


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

	useEffect(() =>
	{
		const currentItemName = data?.itemName || itemName || "محددة";

		if (data)
		{
			document.title = `كشف حركة مادة - ${ currentItemName }`;
		}
		else
		{
			document.title = "كشف حركة مادة";
		}

		return () =>
		{
			document.title = APP_NAME;
		};
	}, [data, itemName]);

	return (
		<ReportPage>
			<ReportPage.ActionButtonsContainer>
				<ReportPage.ExcelButton<ItemStatementLine>
					fileName={ `كشف_مادة_${ itemName || "محددة" }` }
					getRows={ async () => Cubits.ItemStatementReport.result.value?.lines ?? [] }
					columns={ [
						{header: "التاريخ", accessor: (r) => r.date},
						{header: "رقم المستند", accessor: (r) => r.documentId.toString()},
						{header: "المستودع", accessor: (r) => r.storeName},
						{header: "الطرف الثاني", accessor: (r) => r.secondPartyName ?? ""},
						{header: "الكمية الواردة", accessor: (r) => r.quantityIn.toString()},
						{header: "الكمية الصادرة", accessor: (r) => r.quantityOut.toString()},
						{header: "الرصيد الجاري", accessor: (r) => r.runningQuantity.toString()},
						{header: "تكلفة الوحدة", accessor: (r) => r.unitCost.toString()}
					] }
				/>
				<ReportPage.PrintButton/>
			</ReportPage.ActionButtonsContainer>
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