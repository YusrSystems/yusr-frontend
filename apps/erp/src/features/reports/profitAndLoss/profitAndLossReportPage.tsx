import { useEffect, useMemo } from "react";
import { signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import { CrudTablePagination, ReportLoading } from "yusr-ui";
import ReportPage from "@/features/report/reportPage.tsx";
import { ProfitAndLossReportFields } from "@/features/reports/profitAndLoss/profitAndLossReportFields.tsx";
import { ProfitAndLossReport } from "@/features/reports/profitAndLoss/profitAndLossReport.tsx";
import { Cubits } from "@/core/services/cubits.ts";
import { ProfitAndLossReportRequest } from "@/features/reports/profitAndLoss/profitAndLossReportRequest.ts";
import type { ProfitAndLossRow } from "@/features/reports/profitAndLoss/profitAndLossReportResult.ts";
import { ProfitAndLossRowDocumentType } from "@/features/reports/profitAndLoss/profitAndLossReportResult.ts";
import { useTranslation } from "react-i18next";
import { formatNumber } from "@/features/report/utils/formating.ts";


export function ProfitAndLossReportPage()
{
	useSignals();
	const {t} = useTranslation(["accounting", "common"]);

	const lastRequest = useMemo(() => signal<ProfitAndLossReportRequest>(new ProfitAndLossReportRequest()), []);

	useEffect(() =>
	{
		void Cubits.ProfitAndLossReport.getReportData(lastRequest.value, 1);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleSubmit = (request: ProfitAndLossReportRequest) =>
	{
		lastRequest.value = request;
		void Cubits.ProfitAndLossReport.getReportData(request, 1);
	};

	const handlePageChanged = (newPage: number) =>
	{
		void Cubits.ProfitAndLossReport.getReportData(lastRequest.value, newPage);
	};

	const isLoading = Cubits.ProfitAndLossReport.state.value instanceof ReportLoading;
	const data = Cubits.ProfitAndLossReport.result.value;

	const getDocTypeName = (type: ProfitAndLossRowDocumentType) =>
	{
		switch (type)
		{
			case ProfitAndLossRowDocumentType.Sell:
				return t("invoices.sellInvoice");
			case ProfitAndLossRowDocumentType.SellReturn:
				return t("invoices.sellReturn");
			case ProfitAndLossRowDocumentType.Payment:
				return t("vouchers.paymentVoucher");
			default:
				return t("invoices.unknown");
		}
	};

	return (
		<ReportPage>
			<ReportPage.ActionButtonsContainer>
				<ReportPage.ExcelButton<ProfitAndLossRow>
					fileName="تقرير_الأرباح_والخسائر_الشامل"
					getRows={ async () => Cubits.ProfitAndLossReport.result.value?.invoiceListRows ?? [] }
					columns={ [
						{header: "الرقم", accessor: (r) => r.id.toString()},
						{header: "التاريخ", accessor: (r) => r.date},
						{header: "رقم المستند", accessor: (r) => r.documentId.toString()},
						{header: "نوع المستند", accessor: (r) => getDocTypeName(r.documentType)},
						{header: "من", accessor: (r) => r.fromName ?? ""},
						{header: "إلى", accessor: (r) => r.toName ?? ""},
						{header: "البيان", accessor: (r) => r.description ?? ""},
						{header: "التكلفة الإجمالية", accessor: (r) => formatNumber(r.cost)},
						{header: "المبلغ الاجمالي", accessor: (r) => formatNumber(r.amount)},
						{header: "قيمة الضريبة", accessor: (r) => formatNumber(r.taxAmount)},
						{header: "صافي الربح", accessor: (r) => formatNumber(r.profit)}
					] }
				/>
				<ReportPage.PrintButton/>
			</ReportPage.ActionButtonsContainer>
			<div className="print:hidden w-full shrink-0">
				<ProfitAndLossReportFields onSubmit={ handleSubmit } isLoading={ isLoading }/>
			</div>

			<div className="flex-1 min-h-0 flex flex-col print:block">
				<ProfitAndLossReport/>
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