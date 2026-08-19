import { useEffect, useMemo } from "react";
import { signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import { CrudTablePagination, ReportLoading, SystemPermissionsActions } from "yusr-ui";
import ReportPage from "@/features/report/reportPage";
import { TaxAuditReportFields } from "./taxAuditReportFields";
import { TaxAuditReport } from "./taxAuditReport";
import { TaxAuditReportRequest } from "./taxAuditReportRequest";
import { Cubits } from "@/core/services/cubits";
import type { TaxAuditReportLine } from "./taxAuditReportResult";
import { APP_NAME } from "../../../../appConfig.ts";
import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources.ts";
import { Services } from "@/core/services/services.ts";
import Invoice from "@/core/data/invoices/invoice.ts";
import { useTranslation } from "react-i18next";

export function TaxAuditReportPage()
{
	useSignals();
	const {t} = useTranslation("accounting");

	const lastRequest = useMemo(() =>
	{
		const req = new TaxAuditReportRequest();
		const params = new URLSearchParams(window.location.search);
		if (params.get("fromDate")) req.fromDate = params.get("fromDate")!;
		if (params.get("toDate")) req.toDate = params.get("toDate")!;
		return signal<TaxAuditReportRequest>(req);
	}, []);

	useEffect(() =>
	{
		if (!Services.auth.hasAuth(SystemPermissionsResources.ReportTaxAudit, SystemPermissionsActions.Get)) return;
		void Cubits.TaxAuditReport.getReportData(lastRequest.value, 1);
	}, []);

	const handleSubmit = (request: TaxAuditReportRequest) =>
	{
		if (!Services.auth.hasAuth(SystemPermissionsResources.ReportTaxAudit, SystemPermissionsActions.Get)) return;
		lastRequest.value = request;
		void Cubits.TaxAuditReport.getReportData(request, 1);
	};

	const handlePageChanged = (newPage: number) =>
	{
		if (!Services.auth.hasAuth(SystemPermissionsResources.ReportTaxAudit, SystemPermissionsActions.Get)) return;
		void Cubits.TaxAuditReport.getReportData(lastRequest.value, newPage);
	};

	const isLoading = Cubits.TaxAuditReport.state.value instanceof ReportLoading;
	const data = Cubits.TaxAuditReport.result.value;

	useEffect(() =>
	{
		if (data && lastRequest.value.fromDate && lastRequest.value.toDate)
		{
			document.title = `تقرير المراجعة الضريبية - من ${ lastRequest.value.fromDate } إلى ${ lastRequest.value.toDate }`;
		}
		else
		{
			document.title = "تقرير المراجعة الضريبية";
		}
		return () =>
		{
			document.title = APP_NAME;
		};
	}, [data, lastRequest.value.fromDate, lastRequest.value.toDate]);

	return (
		<ReportPage permissionResource={ SystemPermissionsResources.ReportTaxAudit }>
			<ReportPage.ActionButtonsContainer>
				<ReportPage.ExcelButton<TaxAuditReportLine>
					fileName="تقرير_المراجعة_الضريبية"
					getRows={ async () => Cubits.TaxAuditReport.result.value?.lines ?? [] }
					columns={ [
						{header: "التاريخ", accessor: (r) => r.date},
						{header: "نوع المستند", accessor: (r) => Invoice.getTypeName(r.invoiceType, t)},
						{header: "رقم المستند", accessor: (r) => r.invoiceId.toString()},
						{header: "الجهة", accessor: (r) => r.partnerName ?? ""},
						{header: "الرقم الضريبي", accessor: (r) => r.partnerVatNumber ?? ""},
						{header: "المادة", accessor: (r) => r.itemName ?? ""},
						{header: "الكمية", accessor: (r) => r.quantity.toString()},
						{header: "نسبة الضريبة", accessor: (r) => r.taxRate.toString()},
						{header: "المبلغ (غير شامل)", accessor: (r) => r.taxExclusiveAmount.toString()},
						{header: "الضريبة", accessor: (r) => r.taxAmount.toString()},
						{header: "الإجمالي", accessor: (r) => r.taxInclusiveAmount.toString()}
					] }
				/>
				<ReportPage.PrintButton/>
			</ReportPage.ActionButtonsContainer>
			<div className="print:hidden w-full shrink-0">
				<TaxAuditReportFields onSubmit={ handleSubmit } isLoading={ isLoading }/>
			</div>
			<div className="flex-1 min-h-0 flex flex-col print:block">
				<TaxAuditReport/>
			</div>
			{ Cubits.TaxAuditReport.result.value && Cubits.TaxAuditReport.result.value.totalCount > 0 && (
				<CrudTablePagination
					className="print:hidden w-full bg-card text-card-foreground border border-t-0 p-4 shadow-sm rounded-b-xl shrink-0"
					pageSize={ Cubits.TaxAuditReport.result.value.rowsPerPage }
					totalNumber={ Cubits.TaxAuditReport.result.value.totalCount }
					currentPage={ Cubits.TaxAuditReport.result.value.pageNumber }
					onPageChanged={ handlePageChanged }
				/>
			) }
		</ReportPage>
	);
}