import { ReportContainer } from "@/features/report/reportContainer.tsx";
import ReportHeader from "@/features/report/reportHeader.tsx";
import { ReportPageContainer } from "@/features/report/reportPageContainer.tsx";
import { ReportPageBody } from "@/features/report/reportPageBody.tsx";
import { ReportField } from "@/features/report/components/reportField.tsx";
import { StockValuationReportTable } from "./stockValuationReportTable.tsx";
import { StockValuationReportSummary } from "./stockValuationReportSummary.tsx";
import { Cubits } from "@/core/services/cubits.ts";
import { useSignals } from "@preact/signals-react/runtime";
import type { StockValuationReportResult } from "./stockValuationReportResult.ts";


interface StockValuationReportProps
{
	isPortal?: boolean;
}

export function StockValuationReport({isPortal = false}: StockValuationReportProps)
{
	useSignals();

	const state = Cubits.stockValuationReport.state.value;

	// Explicitly cast the data to the correct type
	const data = "data" in state ? (state.data as StockValuationReportResult) : undefined;

	return (
		<ReportContainer isPortal={ isPortal }>
			<ReportPageContainer>
				<thead className="table-header-group">
				<tr>
					<td className="p-0 pb-4">
						<ReportHeader>
							<div className="flex flex-col gap-1">
								<h1 className="text-xl font-bold">تقييم المخزون</h1>
								<h2 className="text-sm text-muted-foreground font-semibold tracking-wider">STOCK
									VALUATION</h2>
							</div>
							<div className="col-span-2 grid grid-cols-2 gap-4">
								<ReportField labelAr="إلى تاريخ" labelEn="As of Date" value={ data?.asOfDate }/>
								<ReportField labelAr="إجمالي التقييم" labelEn="Total Valuation"
								             value={ data ? data.totalInventoryValue.toLocaleString() : "" }/>
							</div>
						</ReportHeader>
					</td>
				</tr>
				</thead>
				<ReportPageBody>
					<StockValuationReportSummary/>
					<StockValuationReportTable/>
				</ReportPageBody>
			</ReportPageContainer>
		</ReportContainer>
	);
}