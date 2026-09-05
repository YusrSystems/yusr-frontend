import { useEffect, useMemo } from "react";
import { signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import { CrudTablePagination, ReportLoading, SystemPermissionsActions } from "yusr-ui";
import ReportPage from "@/features/report/reportPage";
import { ItemsProfitabilityReportFields } from "./itemsProfitabilityReportFields";
import { ItemsProfitabilityReport } from "./itemsProfitabilityReport";
import { ItemsProfitabilityReportRequest } from "./itemsProfitabilityReportRequest";
import { Cubits } from "@/core/services/cubits";
import type { ItemsProfitabilityLine } from "./itemsProfitabilityReportResult";
import { APP_NAME } from "../../../../appConfig";
import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources";
import { Services } from "@/core/services/services";


export function ItemsProfitabilityReportPage()
{
	useSignals();

	const lastRequest = useMemo(() =>
	{
		const req = new ItemsProfitabilityReportRequest();
		const params = new URLSearchParams(window.location.search);
		if (params.get("fromDate")) req.fromDate = params.get("fromDate")!;
		if (params.get("toDate")) req.toDate = params.get("toDate")!;
		return signal<ItemsProfitabilityReportRequest>(req);
	}, []);

	useEffect(() =>
	{
		if (!Services.auth.hasAuth(SystemPermissionsResources.ReportItemsProfitability, SystemPermissionsActions.Get)) return;
		void Cubits.ItemsProfitabilityReport.getReportData(lastRequest.value, 1);
	}, []);

	const handleSubmit = (request: ItemsProfitabilityReportRequest) =>
	{
		if (!Services.auth.hasAuth(SystemPermissionsResources.ReportItemsProfitability, SystemPermissionsActions.Get)) return;
		lastRequest.value = request;
		void Cubits.ItemsProfitabilityReport.getReportData(request, 1);
	};

	const handlePageChanged = (newPage: number) =>
	{
		if (!Services.auth.hasAuth(SystemPermissionsResources.ReportItemsProfitability, SystemPermissionsActions.Get)) return;
		void Cubits.ItemsProfitabilityReport.getReportData(lastRequest.value, newPage);
	};

	const isLoading = Cubits.ItemsProfitabilityReport.state.value instanceof ReportLoading;
	const data = Cubits.ItemsProfitabilityReport.result.value;

	useEffect(() =>
	{
		if (data && lastRequest.value.fromDate && lastRequest.value.toDate)
		{
			document.title = `تقرير ربحية المواد - من ${ lastRequest.value.fromDate } إلى ${ lastRequest.value.toDate } | ${ APP_NAME }`;
		}
		else
		{
			document.title = `تقرير ربحية المواد | ${ APP_NAME }`;
		}
		return () =>
		{
			document.title = APP_NAME;
		};
	}, [data, lastRequest.value.fromDate, lastRequest.value.toDate]);

	return (
		<ReportPage permissionResource={ SystemPermissionsResources.ReportItemsProfitability }>
			<ReportPage.ActionButtonsContainer>
				<ReportPage.ExcelButton<ItemsProfitabilityLine>
					fileName="تقرير_ربحية_المواد"
					getRows={ async () => Cubits.ItemsProfitabilityReport.result.value?.lines ?? [] }
					columns={ [
						{header: "رقم المادة", accessor: (r) => r.itemId},
						{header: "اسم المادة", accessor: (r) => r.itemName},
						{header: "العلامة التجارية", accessor: (r) => r.itemBrand},
						{header: "التصنيفات", accessor: (r) => r.categories.join(", ")},
						{header: "الوحدة", accessor: (r) => r.baseUnitName},
						{header: "الكمية المباعة", accessor: (r) => r.soldQuantity},
						{header: "الكمية المرتجعة", accessor: (r) => r.returnedQuantity},
						{header: "صافي الكمية", accessor: (r) => r.netQuantity},
						{header: "صافي المبيعات", accessor: (r) => r.salesAmount},
						{header: "تكلفة البضاعة (COGS)", accessor: (r) => r.cogsAmount},
						{header: "إجمالي الربح", accessor: (r) => r.profitAmount},
						{header: "هامش الربح %", accessor: (r) => `${ r.marginPercentage }%`}
					] }
				/>
				<ReportPage.PrintButton/>
			</ReportPage.ActionButtonsContainer>
			<div className="print:hidden w-full shrink-0">
				<ItemsProfitabilityReportFields onSubmit={ handleSubmit } isLoading={ isLoading }/>
			</div>
			<div className="flex-1 min-h-0 flex flex-col print:block">
				<ItemsProfitabilityReport/>
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