import { SummaryRow } from "@/features/report/components/summaryRow.tsx";
import { formatNumber } from "@/features/report/utils/formating.ts";
import { Cubits } from "@/core/services/cubits.ts";
import { useSignals } from "@preact/signals-react/runtime";


export function ItemsTaxStatementReportSummary()
{
	useSignals();

	const rows = Cubits.ItemsTaxStatementReport.result.value?.itemTaxStatementRows;
	if (!rows || rows.length === 0)
	{
		return null;
	}

	const netQuantity = rows.reduce((sum, row) => sum + row.quantity, 0);
	const netAmount = rows.reduce((sum, row) => sum + row.amount, 0);
	const netTax = rows.reduce((sum, row) => sum + row.tax, 0);

	return (
		<div className="max-w-md my-3 border border-border rounded-lg overflow-hidden ms-auto divide-y divide-border">
			<SummaryRow>
				<div>
					<SummaryRow.Label label="العدد"/>
					<SummaryRow.Label label="Count"/>
				</div>
				<SummaryRow.Value value={ rows.length.toString() }/>
			</SummaryRow>
			<SummaryRow>
				<div>
					<SummaryRow.Label label="صافي الكمية"/>
					<SummaryRow.Label label="Net Quantity"/>
				</div>
				<SummaryRow.Value value={ formatNumber(netQuantity) }/>
			</SummaryRow>
			<SummaryRow>
				<div>
					<SummaryRow.Label label="صافي المبلغ"/>
					<SummaryRow.Label label="Net Amount"/>
				</div>
				<SummaryRow.Value value={ formatNumber(netAmount) }/>
			</SummaryRow>
			<SummaryRow className="bg-muted/50">
				<div>
					<SummaryRow.Label label="صافي الضريبة"/>
					<SummaryRow.Label label="Net Tax"/>
				</div>
				<SummaryRow.Value className="text-destructive!" value={ formatNumber(netTax) }/>
			</SummaryRow>
		</div>
	);
}