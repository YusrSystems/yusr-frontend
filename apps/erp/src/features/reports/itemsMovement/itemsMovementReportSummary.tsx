import { SummaryRow } from "@/features/report/components/summaryRow.tsx";
import { formatNumber } from "@/features/report/utils/formating.ts";
import { Cubits } from "@/core/services/cubits.ts";
import { useSignals } from "@preact/signals-react/runtime";


export function ItemsMovementReportSummary()
{
	useSignals();

	const data = Cubits.ItemsMovementReport.result.value;
	if (!data)
	{
		return null;
	}

	const netQtn = data.totalQuantityIn - data.totalQuantityOut;

	return (
		<div className="max-w-md my-3 border border-border rounded-lg overflow-hidden ms-auto divide-y divide-border">
			<SummaryRow>
				<div>
					<SummaryRow.Label label="مجموع الكمية الواردة"/>
					<SummaryRow.Label label="Total incoming qtn"/>
				</div>
				<SummaryRow.Value value={ formatNumber(data.totalQuantityIn) }/>
			</SummaryRow>

			<SummaryRow>
				<div>
					<SummaryRow.Label label="مجموع الكمية الصادرة"/>
					<SummaryRow.Label label="Total exported qtn"/>
				</div>
				<SummaryRow.Value value={ formatNumber(data.totalQuantityOut) }/>
			</SummaryRow>

			<SummaryRow>
				<div>
					<SummaryRow.Label label="صافي الكمية"/>
					<SummaryRow.Label label="Net qtn"/>
				</div>
				<SummaryRow.Value value={ formatNumber(netQtn) }/>
			</SummaryRow>

			<SummaryRow className="bg-muted/50">
				<div>
					<SummaryRow.Label label="إجمالي القيمة"/>
					<SummaryRow.Label label="Total Value"/>
				</div>
				<SummaryRow.Value className="text-destructive!" value={ formatNumber(data.totalValue) }/>
			</SummaryRow>
		</div>
	);
}