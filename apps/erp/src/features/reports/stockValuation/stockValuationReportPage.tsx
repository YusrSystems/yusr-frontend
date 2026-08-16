import { useEffect, useMemo } from "react";
import { signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import { CrudTablePagination, ReportLoading, SystemPermissionsActions } from "yusr-ui";
import ReportPage from "@/features/report/reportPage.tsx";
import { StockValuationReportFields } from "./stockValuationReportFields.tsx";
import { StockValuationReport } from "./stockValuationReport.tsx";
import { StockValuationReportRequest } from "./stockValuationReportRequest.ts";
import type { StockValuationLine } from "./stockValuationReportResult.ts";
import { Cubits } from "@/core/services/cubits.ts";
import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources.ts";
import { Services } from "@/core/services/services.ts";
import { APP_NAME } from "../../../../appConfig.ts";


export function StockValuationReportPage()
{
	useSignals();

	const lastRequest = useMemo(() => signal(new StockValuationReportRequest()), []);

	useEffect(() =>
	{
		if (!Services.auth.hasAuth(SystemPermissionsResources.ReportStockValuation, SystemPermissionsActions.Get)) return;
		const initialRequest = new StockValuationReportRequest();
		lastRequest.value = initialRequest;
		void Cubits.stockValuationReport.getReportData(initialRequest, 1);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleSubmit = (request: StockValuationReportRequest) =>
	{
		if (!Services.auth.hasAuth(SystemPermissionsResources.ReportStockValuation, SystemPermissionsActions.Get)) return;
		lastRequest.value = request;
		void Cubits.stockValuationReport.getReportData(request, 1);
	};

	const handlePageChanged = (newPage: number) =>
	{
		if (!Services.auth.hasAuth(SystemPermissionsResources.ReportStockValuation, SystemPermissionsActions.Get)) return;
		void Cubits.stockValuationReport.getReportData(lastRequest.value, newPage);
	};

	const isLoading = Cubits.stockValuationReport.state.value instanceof ReportLoading;
	const data = Cubits.stockValuationReport.result.value;

	useEffect(() =>
	{
		if (data?.asOfDate)
		{
			document.title = `تقييم المخزون - ${ data.asOfDate }`;
		}
		else
		{
			document.title = "تقييم المخزون";
		}

		return () =>
		{
			document.title = APP_NAME;
		};
	}, [data]);

	return (
		<ReportPage permissionResource={ SystemPermissionsResources.ReportStockValuation }>
			<ReportPage.ActionButtonsContainer>
				<ReportPage.ExcelButton<StockValuationLine>
					fileName="تقرير_تقييم_المخزون"
					getRows={ async () => Cubits.stockValuationReport.result.value?.lines ?? [] }
					columns={ [
						{header: "رقم المادة", accessor: (r) => r.itemId},
						{header: "اسم المادة", accessor: (r) => r.itemName},
						{header: "التصنيف", accessor: (r) => r.categories?.join(" - ") ?? ""},
						{header: "العلامة التجارية", accessor: (r) => r.itemBrand ?? ""},
						{header: "الوحدة", accessor: (r) => r.baseUnitName},
						{header: "المستودع", accessor: (r) => r.storeName},
						{header: "الكمية", accessor: (r) => r.quantityOnHand.toString()},
						{header: "متوسط التكلفة", accessor: (r) => r.averageCost.toString()},
						{header: "إجمالي القيمة", accessor: (r) => r.totalValuation.toString()}
					] }
				/>
				<ReportPage.PrintButton/>
			</ReportPage.ActionButtonsContainer>

			<div className="print:hidden w-full shrink-0">
				<StockValuationReportFields onSubmit={ handleSubmit } isLoading={ isLoading }/>
			</div>

			<div className="flex-1 min-h-0 flex flex-col print:block">
				<StockValuationReport/>
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