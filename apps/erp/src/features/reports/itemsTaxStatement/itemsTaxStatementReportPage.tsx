import { useEffect, useMemo } from "react";
import { signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import { CrudTablePagination, ReportLoading } from "yusr-ui";
import ReportPage from "@/features/report/reportPage.tsx";
import { ItemsTaxStatementReportFields } from "@/features/reports/itemsTaxStatement/itemsTaxStatementReportFields.tsx";
import { ItemsTaxStatementReport } from "@/features/reports/itemsTaxStatement/itemsTaxStatementReport.tsx";
import { ItemsTaxStatementReportRequest } from "./itemsTaxStatementReportRequest.ts";
import { Cubits } from "@/core/services/cubits.ts";
import type { ItemTaxStatementRow } from "@/features/reports/itemsTaxStatement/itemsTaxStatementReportResult.ts";


export function ItemsTaxStatementReportPage()
{
	useSignals();

	const lastRequest = useMemo(() => signal<ItemsTaxStatementReportRequest>(new ItemsTaxStatementReportRequest()), []);

	useEffect(() =>
	{
		void Cubits.ItemsTaxStatementReport.getReportData(lastRequest.value, 1);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleSubmit = (request: ItemsTaxStatementReportRequest) =>
	{
		lastRequest.value = request;
		void Cubits.ItemsTaxStatementReport.getReportData(request, 1);
	};

	const handlePageChanged = (newPage: number) =>
	{
		void Cubits.ItemsTaxStatementReport.getReportData(lastRequest.value, newPage);
	};

	const isLoading = Cubits.ItemsTaxStatementReport.state.value instanceof ReportLoading;
	const data = Cubits.ItemsTaxStatementReport.result.value;

	return (
		<ReportPage>
			<ReportPage.ActionButtonsContainer>
				<ReportPage.ExcelButton<ItemTaxStatementRow>
					fileName="كشف_ضريبة_المواد"
					getRows={ async () => Cubits.ItemsTaxStatementReport.result.value?.itemTaxStatementRows ?? [] }
					columns={ [
						{header: "الرقم", accessor: (r) => r.id.toString()},
						{header: "التاريخ", accessor: (r) => r.date},
						{header: "رقم الفاتورة", accessor: (r) => r.invoiceId.toString()},
						{header: "اسم المادة", accessor: (r) => r.itemName},
						{header: "من (المرسل)", accessor: (r) => r.from},
						{header: "إلى (المستقبل)", accessor: (r) => r.to},
						{header: "الكمية", accessor: (r) => r.quantity.toString()},
						{header: "المبلغ الخاضع للضريبة", accessor: (r) => r.amount.toString()},
						{header: "قيمة الضريبة", accessor: (r) => r.tax.toString()}
					] }
				/>
				<ReportPage.PrintButton/>
			</ReportPage.ActionButtonsContainer>
			<div className="print:hidden w-full shrink-0">
				<ItemsTaxStatementReportFields onSubmit={ handleSubmit } isLoading={ isLoading }/>
			</div>

			<div className="flex-1 min-h-0 flex flex-col print:block">
				<ItemsTaxStatementReport/>
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