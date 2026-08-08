import { SummaryRow } from "@/features/report/components/summaryRow.tsx";
import { formatNumber } from "@/features/report/utils/formating.ts";
import { Cubits } from "@/core/services/cubits.ts";
import { useSignals } from "@preact/signals-react/runtime";
import type { StockValuationReportResult } from "./stockValuationReportResult.ts";


export function StockValuationReportSummary()
{
	useSignals();
	const state = Cubits.stockValuationReport.state.value;

	if (!("data" in state) || !state.data) return null;

	// Explicitly cast the data to the correct type
	const data = state.data as StockValuationReportResult;

	return (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
			<SummaryRow className="bg-primary/5 border border-primary/20 rounded-lg justify-between shadow-sm">
				<span className="text-sm font-bold text-primary">إجمالي قيمة المخزون (Total Valuation)</span>
				<span className="text-lg font-black text-primary">{ formatNumber(data.totalInventoryValue) }</span>
			</SummaryRow>
		</div>
	);
}