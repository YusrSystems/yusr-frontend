import { SummaryRow } from "@/features/report/components/summaryRow.tsx";
import { formatNumber } from "@/features/report/utils/formating.ts";
import { Cubits } from "@/core/services/cubits.ts";
import { useSignals } from "@preact/signals-react/runtime";


export function StockValuationReportSummary()
{
	useSignals();

	const data = Cubits.stockValuationReport.result.value;
	if (!data) return null;

	return (
		<div className="max-w-md my-3 border border-border rounded-lg overflow-hidden ms-auto divide-y divide-border">
			<SummaryRow>
				<div>
					<SummaryRow.Label label="إجمالي قيمة المخزون"/>
					<SummaryRow.Label label="Total Valuation"/>
				</div>
				<SummaryRow.Value className="text-primary font-bold" value={ formatNumber(data.totalInventoryValue) }/>
			</SummaryRow>
		</div>
	);
}