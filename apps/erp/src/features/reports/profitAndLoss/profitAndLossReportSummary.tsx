import { SummaryRow } from "@/features/report/components/summaryRow.tsx";
import { formatNumber } from "@/features/report/utils/formating.ts";
import { Cubits } from "@/core/services/cubits.ts";
import { useSignals } from "@preact/signals-react/runtime";


export function ProfitAndLossReportSummary()
{
	useSignals();

	const rows = Cubits.ProfitAndLossReport.result.value?.invoiceListRows;
	if (!rows || rows.length === 0)
	{
		return null;
	}

	const totalCost = rows.reduce((sum, row) => sum + row.cost, 0);
	const totalAmount = rows.reduce((sum, row) => sum + row.amount, 0);
	const totalTax = rows.reduce((sum, row) => sum + row.taxAmount, 0);
	const totalProfit = rows.reduce((sum, row) => sum + row.profit, 0);

	return (
		<div className="max-w-md my-3 border border-border rounded-lg overflow-hidden ms-auto divide-y divide-border">
			<SummaryRow>
				<div>
					<SummaryRow.Label label="مجموع التكلفة"/>
					<SummaryRow.Label label="Total Cost"/>
				</div>
				<SummaryRow.Value value={ formatNumber(totalCost) }/>
			</SummaryRow>
			<SummaryRow>
				<div>
					<SummaryRow.Label label="مجموع المبلغ"/>
					<SummaryRow.Label label="Total Amount"/>
				</div>
				<SummaryRow.Value value={ formatNumber(totalAmount) }/>
			</SummaryRow>
			<SummaryRow>
				<div>
					<SummaryRow.Label label="مجموع الضريبة"/>
					<SummaryRow.Label label="Total Tax"/>
				</div>
				<SummaryRow.Value value={ formatNumber(totalTax) }/>
			</SummaryRow>
			<SummaryRow className="bg-muted/50">
				<div>
					<SummaryRow.Label label="مجموع الربح"/>
					<SummaryRow.Label label="Total Profit"/>
				</div>
				<SummaryRow.Value className="text-destructive!" value={ formatNumber(totalProfit) }/>
			</SummaryRow>
		</div>
	);
}