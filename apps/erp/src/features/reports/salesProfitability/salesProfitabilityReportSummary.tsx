import { SummaryRow } from "@/features/report/components/summaryRow";
import { formatNumber } from "@/features/report/utils/formating";
import { Cubits } from "@/core/services/cubits";
import { useSignals } from "@preact/signals-react/runtime";


export function SalesProfitabilityReportSummary()
{
	useSignals();

	const data = Cubits.SalesProfitabilityReport.result.value;
	if (!data)
	{
		return null;
	}

	return (
		<div className="max-w-md my-3 border border-border rounded-lg overflow-hidden ms-auto divide-y divide-border">
			<SummaryRow>
				<div>
					<SummaryRow.Label label="إجمالي المبيعات"/>
					<SummaryRow.Label label="Total Sales"/>
				</div>
				<SummaryRow.Value className="text-blue-600!" value={ formatNumber(data.pageTotalSales) }/>
			</SummaryRow>

			<SummaryRow>
				<div>
					<SummaryRow.Label label="إجمالي تكلفة البضاعة"/>
					<SummaryRow.Label label="Total COGS"/>
				</div>
				<SummaryRow.Value className="text-orange-600!" value={ formatNumber(data.pageTotalCogs) }/>
			</SummaryRow>

			<SummaryRow>
				<div>
					<SummaryRow.Label label="إجمالي التكاليف المباشرة"/>
					<SummaryRow.Label label="Total Direct Costs"/>
				</div>
				<SummaryRow.Value className="text-red-600!" value={ formatNumber(data.pageTotalDirectCosts) }/>
			</SummaryRow>

			<SummaryRow className="bg-muted/50">
				<div>
					<SummaryRow.Label label="صافي الربح"/>
					<SummaryRow.Label label="Net Profit"/>
				</div>
				<SummaryRow.Value className={ data.pageNetProfit >= 0 ? "text-emerald-600!" : "text-destructive!" }
				                  value={ formatNumber(data.pageNetProfit) }/>
			</SummaryRow>
		</div>
	);
}