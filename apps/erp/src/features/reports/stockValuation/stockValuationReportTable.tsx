import { ReportTableTh } from "@/features/report/components/reportTableTh.tsx";
import { ReportTableTd } from "@/features/report/components/reportTableTd.tsx";
import { formatNumber } from "@/features/report/utils/formating.ts";
import { Cubits } from "@/core/services/cubits.ts";
import { useSignals } from "@preact/signals-react/runtime";
import { ReportLoading, TablePreview } from "yusr-ui";
import type { StockValuationReportResult } from "./stockValuationReportResult.ts";


export function StockValuationReportTable()
{
	useSignals();
	const state = Cubits.stockValuationReport.state.value;

	if (state instanceof ReportLoading) return <TablePreview.Loading/>;
	if (!("data" in state) || !state.data) return <TablePreview.Empty/>;

	// Explicitly cast the data to the correct type
	const data = state.data as StockValuationReportResult;
	const lines = data.lines;

	if (lines.length === 0) return <TablePreview.Empty/>;

	return (
		<div className="overflow-x-auto rounded-lg border border-border">
			<table className="w-full text-sm">
				<thead className="bg-muted text-muted-foreground whitespace-nowrap">
				<tr>
					<ReportTableTh ar="رقم المادة" en="Item ID"/>
					<ReportTableTh ar="اسم المادة" en="Item Name" align="start"/>
					<ReportTableTh ar="التصنيف" en="Class"/>
					<ReportTableTh ar="الماركة" en="Brand"/>
					<ReportTableTh ar="الوحدة" en="Base Unit"/>
					<ReportTableTh ar="المستودع" en="Store"/>
					<ReportTableTh ar="الكمية" en="Qty On Hand"/>
					<ReportTableTh ar="متوسط التكلفة" en="Avg Cost"/>
					<ReportTableTh ar="إجمالي القيمة" en="Total Value"/>
				</tr>
				</thead>
				<tbody>
				{ lines.map((line, index) => (
					<tr key={ index }
					    className="border-b border-border last:border-b-0 hover:bg-muted/50 transition-colors">
						<ReportTableTd isEven={ index % 2 === 0 }>{ line.itemId }</ReportTableTd>
						<ReportTableTd isEven={ index % 2 === 0 } align="start">{ line.itemName }</ReportTableTd>
						<ReportTableTd isEven={ index % 2 === 0 }>{ line.itemClass || "-" }</ReportTableTd>
						<ReportTableTd isEven={ index % 2 === 0 }>{ line.itemBrand || "-" }</ReportTableTd>
						<ReportTableTd isEven={ index % 2 === 0 }>{ line.baseUnitName }</ReportTableTd>
						<ReportTableTd isEven={ index % 2 === 0 }>{ line.storeName }</ReportTableTd>
						<ReportTableTd isEven={ index % 2 === 0 } className="font-semibold">
							<span dir="ltr">{ formatNumber(line.quantityOnHand) }</span>
						</ReportTableTd>
						<ReportTableTd isEven={ index % 2 === 0 }>
							<span dir="ltr">{ formatNumber(line.averageCost) }</span>
						</ReportTableTd>
						<ReportTableTd isEven={ index % 2 === 0 } className="font-bold text-primary">
							<span dir="ltr">{ formatNumber(line.totalValuation) }</span>
						</ReportTableTd>
					</tr>
				)) }
				</tbody>
			</table>
		</div>
	);
}