import { useEffect, useMemo } from "react";
import { signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import { CrudTablePagination, ReportLoading } from "yusr-ui";
import ReportPage from "@/features/report/reportPage.tsx";
import { ItemsMovementReportFields } from "@/features/reports/itemsMovement/itemsMovementReportFields.tsx";
import { ItemsMovementReport } from "@/features/reports/itemsMovement/itemsMovementReport.tsx";
import { ItemsMovementReportRequest } from "@/features/reports/itemsMovement/itemsMovementReportRequest.ts";
import { Cubits } from "@/core/services/cubits.ts";
import type { ItemsMovementLine } from "@/features/reports/itemsMovement/itemsMovementReportResult.ts";
import { getDocumentTypeName } from "@/core/types/documentType.ts";


export function ItemsMovementReportPage()
{
	useSignals();

	const lastRequest = useMemo(() => signal<ItemsMovementReportRequest>(new ItemsMovementReportRequest()), []);

	useEffect(() =>
	{
		void Cubits.ItemsMovementReport.getReportData(lastRequest.value, 1);
		// eslint-disable-next-line react-hooks/exhaustive-deps
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
			<ReportPage.ActionButtonsContainer>
				<ReportPage.ExcelButton<ItemsMovementLine>
					fileName="تقرير_حركة_المواد"
					getRows={ async () => Cubits.ItemsMovementReport.result.value?.lines ?? [] }
					columns={ [
						{header: "التاريخ", accessor: (r) => r.date},
						{header: "نوع المستند", accessor: (r) => getDocumentTypeName(r.documentType)},
						{header: "رقم المستند", accessor: (r) => r.documentId.toString()},
						{header: "اسم المادة", accessor: (r) => r.itemName},
						{header: "المستودع", accessor: (r) => r.storeName},
						{header: "الشريك", accessor: (r) => r.partnerName ?? ""},
						{header: "الكمية الواردة", accessor: (r) => r.quantityIn.toString()},
						{header: "الكمية الصادرة", accessor: (r) => r.quantityOut.toString()},
						{header: "تكلفة الوحدة", accessor: (r) => r.unitCost.toString()},
						{header: "القيمة", accessor: (r) => r.value.toString()}
					] }
				/>
				<ReportPage.PrintButton/>
			</ReportPage.ActionButtonsContainer>

			<div className="print:hidden w-full shrink-0">
				<ItemsMovementReportFields onSubmit={ handleSubmit } isLoading={ isLoading }/>
			</div>

			<div className="flex-1 min-h-0 flex flex-col print:block">
				<ItemsMovementReport/>
			</div>

			{ Cubits.ItemsMovementReport.result.value && Cubits.ItemsMovementReport.result.value.totalCount > 0 && (
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