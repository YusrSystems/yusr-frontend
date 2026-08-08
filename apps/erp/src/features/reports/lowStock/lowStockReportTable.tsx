import { ReportTableTh } from "@/features/report/components/reportTableTh.tsx";
import { ReportTableTd } from "@/features/report/components/reportTableTd.tsx";
import { formatNumber } from "@/features/report/utils/formating.ts";
import { Cubits } from "@/core/services/cubits.ts";
import { useSignals } from "@preact/signals-react/runtime";
import { ReportLoading, TablePreview } from "yusr-ui";
import type { LowStockReportResult } from "./lowStockReportResult.ts";


export function LowStockReportTable()
{
	useSignals();
	const state = Cubits.lowStockReport.state.value;

	if (state instanceof ReportLoading) return <TablePreview.Loading/>;
	if (!("data" in state) || !state.data) return <TablePreview.Empty/>;

	const data = state.data as LowStockReportResult;
	const lines = data.lines;

	if (lines.length === 0) return <TablePreview.Empty/>;

	return (
		<div className="overflow-x-auto rounded-lg border border-border">
			<table className="w-full text-sm">
				<thead className="bg-muted text-muted-foreground whitespace-nowrap">
				<tr>
					<ReportTableTh ar="رقم المادة" en="Item ID"/>
					<ReportTableTh ar="اسم المادة" en="Item Name" align="start"/>
					<ReportTableTh ar="الوحدة" en="Base Unit"/>
					<ReportTableTh ar="الحد الأدنى" en="Min Limit"/>
					<ReportTableTh ar="الحد الأعلى" en="Max Limit"/>
					<ReportTableTh ar="الكمية الحالية" en="In Stock"/>
					<ReportTableTh ar="الكمية المقترحة للطلب" en="Suggested Reorder"/>
				</tr>
				</thead>
				<tbody>
				{ lines.map((line, index) => (
					<tr key={ index }
					    className="border-b border-border last:border-b-0 hover:bg-muted/50 transition-colors">
						<ReportTableTd isEven={ index % 2 === 0 }>{ line.itemId }</ReportTableTd>
						<ReportTableTd isEven={ index % 2 === 0 } align="start">{ line.itemName }</ReportTableTd>
						<ReportTableTd isEven={ index % 2 === 0 }>{ line.baseUnitName }</ReportTableTd>
						<ReportTableTd isEven={ index % 2 === 0 }>
							<span
								dir="ltr">{ line.minQuantityLimit != null ? formatNumber(line.minQuantityLimit) : "-" }</span>
						</ReportTableTd>
						<ReportTableTd isEven={ index % 2 === 0 }>
							<span
								dir="ltr">{ line.maxQuantityLimit != null ? formatNumber(line.maxQuantityLimit) : "-" }</span>
						</ReportTableTd>
						<ReportTableTd isEven={ index % 2 === 0 } className="font-semibold text-destructive">
							<span dir="ltr">{ formatNumber(line.quantityInStock) }</span>
						</ReportTableTd>
						<ReportTableTd isEven={ index % 2 === 0 } className="font-bold text-emerald-600">
							<span dir="ltr">{ formatNumber(line.suggestedReorderQty) }</span>
						</ReportTableTd>
					</tr>
				)) }
				</tbody>
			</table>
		</div>
	);
}