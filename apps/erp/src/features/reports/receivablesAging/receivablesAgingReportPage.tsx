import { useEffect, useMemo } from "react";
import { signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import { CrudTablePagination, ReportLoading, SystemPermissionsActions } from "yusr-ui";
import ReportPage from "@/features/report/reportPage";
import { ReceivablesAgingReportFields } from "./receivablesAgingReportFields";
import { ReceivablesAgingReport } from "./receivablesAgingReport";
import { ReceivablesAgingReportRequest } from "./receivablesAgingReportRequest";
import { Cubits } from "@/core/services/cubits";
import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources";
import { Services } from "@/core/services/services";
import { APP_NAME } from "../../../../appConfig";
import { getReceivablesAgingBucketName, ReceivablesAgingViewMode } from "@/core/types/receivablesAging";
import type { CustomerAgingSummaryLine, InvoiceAgingDetailLine } from "./receivablesAgingReportResult";


export function ReceivablesAgingReportPage()
{
	useSignals();
	const currentViewMode = useMemo(() => signal<ReceivablesAgingViewMode>(ReceivablesAgingViewMode.Summary), []);

	const lastRequest = useMemo(() =>
	{
		const req = new ReceivablesAgingReportRequest();
		const params = new URLSearchParams(window.location.search);
		if (params.get("asOfDate")) req.asOfDate = params.get("asOfDate")!;
		return signal<ReceivablesAgingReportRequest>(req);
	}, []);

	useEffect(() =>
	{
		if (!Services.auth.hasAuth(SystemPermissionsResources.ReportReceivablesAging, SystemPermissionsActions.Get)) return;
		void Cubits.receivablesAgingReport.getReportData(lastRequest.value, 1);
		Cubits.stores.init();
	}, []);

	const handleSubmit = (request: ReceivablesAgingReportRequest) =>
	{
		if (!Services.auth.hasAuth(SystemPermissionsResources.ReportReceivablesAging, SystemPermissionsActions.Get)) return;
		lastRequest.value = request;
		currentViewMode.value = request.viewMode;
		void Cubits.receivablesAgingReport.getReportData(request, 1);
	};

	const handleViewModeChange = (newMode: ReceivablesAgingViewMode) =>
	{
		currentViewMode.value = newMode;
		lastRequest.value.viewMode = newMode;
		void Cubits.receivablesAgingReport.getReportData(lastRequest.value, 1);
	};

	const handlePageChanged = (newPage: number) =>
	{
		if (!Services.auth.hasAuth(SystemPermissionsResources.ReportReceivablesAging, SystemPermissionsActions.Get)) return;
		void Cubits.receivablesAgingReport.getReportData(lastRequest.value, newPage);
	};

	const isLoading = Cubits.receivablesAgingReport.state.value instanceof ReportLoading;
	const data = Cubits.receivablesAgingReport.result.value;

	useEffect(() =>
	{
		document.title = `تقرير أعمار ديون العملاء | ${ APP_NAME }`;
		return () =>
		{
			document.title = APP_NAME;
		};
	}, []);

	const isDetailed = currentViewMode.value === ReceivablesAgingViewMode.Detailed;

	return (
		<ReportPage permissionResource={ SystemPermissionsResources.ReportReceivablesAging }>
			<ReportPage.ActionButtonsContainer>
				{ isDetailed ? (
					<ReportPage.ExcelButton<InvoiceAgingDetailLine>
						fileName="تقرير_أعمار_الديون_تفصيلي"
						getRows={ async () => Cubits.receivablesAgingReport.result.value?.invoices ?? [] }
						columns={ [
							{header: "رقم الفاتورة", accessor: (r) => r.invoiceId},
							{header: "العميل", accessor: (r) => r.partnerName},
							{header: "تاريخ الإصدار", accessor: (r) => r.issueDate},
							{header: "تاريخ الاستحقاق", accessor: (r) => r.dueDate ?? ""},
							{header: "أيام التأخير", accessor: (r) => r.overdueDays},
							{header: "المبلغ الإجمالي", accessor: (r) => r.fullAmount},
							{header: "المدفوع", accessor: (r) => r.paidAmount},
							{header: "المرتجع", accessor: (r) => r.creditedAmount},
							{header: "المتبقي المستحق", accessor: (r) => r.remainingAmount},
							{header: "فترة التقادم", accessor: (r) => getReceivablesAgingBucketName(r.bucket)}
						] }
					/>
				) : (
					<ReportPage.ExcelButton<CustomerAgingSummaryLine>
						fileName="تقرير_أعمار_الديون_ملخص"
						getRows={ async () => Cubits.receivablesAgingReport.result.value?.customers ?? [] }
						columns={ [
							{header: "رقم العميل", accessor: (r) => r.partnerId},
							{header: "اسم العميل", accessor: (r) => r.partnerName},
							{header: "الهاتف", accessor: (r) => r.partnerMobile || r.partnerPhone || ""},
							{header: "عدد الفواتير المفتوحة", accessor: (r) => r.openInvoicesCount},
							{header: "حالي (غير مستحق)", accessor: (r) => r.current},
							{header: "1 - 30 يوم", accessor: (r) => r.days1To30},
							{header: "31 - 60 يوم", accessor: (r) => r.days31To60},
							{header: "61 - 90 يوم", accessor: (r) => r.days61To90},
							{header: "+90 يوم", accessor: (r) => r.days90Plus},
							{header: "إجمالي الرصيد المستحق", accessor: (r) => r.totalOutstanding}
						] }
					/>
				) }
				<ReportPage.PrintButton/>
			</ReportPage.ActionButtonsContainer>

			<div className="print:hidden w-full shrink-0">
				<ReceivablesAgingReportFields
					onSubmit={ handleSubmit }
					isLoading={ isLoading }
					currentViewMode={ currentViewMode.value }
					onViewModeChange={ handleViewModeChange }
				/>
			</div>

			<div className="flex-1 min-h-0 flex flex-col print:block">
				<ReceivablesAgingReport/>
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