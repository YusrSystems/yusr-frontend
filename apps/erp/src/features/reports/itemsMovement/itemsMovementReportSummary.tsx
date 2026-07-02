import { SummaryRow } from "@/features/report/components/summaryRow.tsx";
import { formatNumber } from "@/features/report/utils/formating.ts";
import { ItemsMovementReportType } from "@/features/reports/itemsMovement/itemsMovementReportResult.ts";
import { Cubits } from "@/core/services/cubits.ts";


export function ItemsMovementReportSummary()
{
	if (Cubits.ItemsMovementReport.result.value?.reportType !== ItemsMovementReportType.ItemsMovement)
	{
		return null;
	}

	const netQtn = Cubits.ItemsMovementReport.result.value.totalIncomeQtn - Cubits.ItemsMovementReport.result.value.totalOutcomeQtn;
	const netAmount = Cubits.ItemsMovementReport.result.value.totalIncomeAmount - Cubits.ItemsMovementReport.result.value.totalOutcomeAmount;

	return (
		<div
			className="max-w-md  my-3 border border-border rounded-lg overflow-hidden ms-auto divide-y divide-border">
			<SummaryRow>
				<div>
					<SummaryRow.Label label="مجموع الكمية الواردة"/>
					<SummaryRow.Label label="Total incoming qtn"/>
				</div>
				<SummaryRow.Value value={ formatNumber(Cubits.ItemsMovementReport.result.value.totalIncomeQtn) }/>
			</SummaryRow>
			<SummaryRow>
				<div>
					<SummaryRow.Label label="مجموع الكمية الصادرة"/>
					<SummaryRow.Label label="Total exported qtn"/>
				</div>
				<SummaryRow.Value value={ formatNumber(Cubits.ItemsMovementReport.result.value.totalOutcomeQtn) }/>
			</SummaryRow>
			<SummaryRow>
				<div>
					<SummaryRow.Label label="صافي الكمية"/>
					<SummaryRow.Label label="Net qtn"/>
				</div>
				<SummaryRow.Value value={ formatNumber(netQtn) }/>
			</SummaryRow>
			<SummaryRow>
				<div>
					<SummaryRow.Label label="مجموع المبلغ الوارد"/>
					<SummaryRow.Label label="Total incoming amount"/>
				</div>
				<SummaryRow.Value value={ formatNumber(Cubits.ItemsMovementReport.result.value.totalIncomeAmount) }/>
			</SummaryRow>
			<SummaryRow>
				<div>
					<SummaryRow.Label label="مجموع المبلغ الصادر"/>
					<SummaryRow.Label label="Total outcoming amount"/>
				</div>
				<SummaryRow.Value value={ formatNumber(Cubits.ItemsMovementReport.result.value.totalOutcomeAmount) }/>
			</SummaryRow>
			<SummaryRow>
				<div>
					<SummaryRow.Label label="صافي المبلغ"/>
					<SummaryRow.Label label="Net amount"/>
				</div>
				<SummaryRow.Value value={ formatNumber(netAmount) }/>
			</SummaryRow>
			<SummaryRow className="bg-muted/50">
				<div>
					<SummaryRow.Label label="مجموع الربح"/>
					<SummaryRow.Label label="Total Profit"/>
				</div>
				<SummaryRow.Value className="text-destructive!"
				                  value={ formatNumber(Cubits.ItemsMovementReport.result.value.totalProfit) }/>
			</SummaryRow>
		</div>
	);
}