import { SummaryRow } from "@/features/report/components/summaryRow.tsx";
import { useSignals } from "@preact/signals-react/runtime";
import { Cubits } from "@/core/services/cubits.ts";
import { formatNumber } from "@/features/report/utils/formating.ts";


export function ItemsListReportSummary()
{
	useSignals();
	return (
		<div className="max-w-100 p-3 my-3 border border-border rounded-lg overflow-hidden ms-auto">
			<SummaryRow>
				<div>
					<SummaryRow.Label label="مجموع التكاليف"/>
					<SummaryRow.Label label="Total Costs"/>
				</div>
				<SummaryRow.Value
					className="text-destructive!"
					value={ formatNumber(Cubits.items.entities.value.reduce(
						(sum, item) => sum + (item.quantity * item.cost),
						0
					)) }
				/>
			</SummaryRow>
		</div>
	);
}