import { SummaryRow } from "@/features/report/components/summaryRow";
import { formatNumber } from "@/features/report/utils/formating";
import { Cubits } from "@/core/services/cubits";
import { useSignals } from "@preact/signals-react/runtime";


export function ItemsProfitabilityReportSummary()
{
	useSignals();
	const data = Cubits.ItemsProfitabilityReport.result.value;
	if (!data)
	{
		return null;
	}

	return (
		<div className="max-w-md my-4 border border-border rounded-lg overflow-hidden ms-auto divide-y divide-border">
			<SummaryRow>
				<div>
					<SummaryRow.Label label="صافي الكمية"/>
					<SummaryRow.Label label="Net Quantity"/>
				</div>
				<SummaryRow.Value value={ formatNumber(data.pageNetQuantity) }/>
			</SummaryRow>
			<SummaryRow>
				<div>
					<SummaryRow.Label label="إجمالي المبيعات"/>
					<SummaryRow.Label label="Net Sales"/>
				</div>
				<SummaryRow.Value className="text-blue-600!" value={ formatNumber(data.pageTotalSales) }/>
			</SummaryRow>
			<SummaryRow>
				<div>
					<SummaryRow.Label label="إجمالي تكلفة البضاعة"/>
					<SummaryRow.Label label="COGS"/>
				</div>
				<SummaryRow.Value className="text-orange-600!" value={ formatNumber(data.pageTotalCogs) }/>
			</SummaryRow>
			<SummaryRow>
				<div>
					<SummaryRow.Label label="إجمالي الأرباح"/>
					<SummaryRow.Label label="Gross Profit"/>
				</div>
				<SummaryRow.Value
					className={ data.pageTotalProfit >= 0 ? "text-emerald-600!" : "text-destructive!" }
					value={ formatNumber(data.pageTotalProfit) }
				/>
			</SummaryRow>
			<SummaryRow className="bg-muted/50">
				<div>
					<SummaryRow.Label label="هامش الربح %"/>
					<SummaryRow.Label label="Margin %"/>
				</div>
				<SummaryRow.Value
					className={ `font-bold ${ data.pageMarginPercentage >= 0 ? "text-emerald-600!" : "text-destructive!" }` }
					value={ `${ formatNumber(data.pageMarginPercentage) }%` }
				/>
			</SummaryRow>
		</div>
	);
}