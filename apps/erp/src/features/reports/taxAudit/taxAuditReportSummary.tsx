import { SummaryRow } from "@/features/report/components/summaryRow";
import { formatNumber } from "@/features/report/utils/formating";
import { Cubits } from "@/core/services/cubits";
import { useSignals } from "@preact/signals-react/runtime";


export function TaxAuditReportSummary()
{
	useSignals();

	const data = Cubits.TaxAuditReport.result.value;
	if (!data)
	{
		return null;
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-3">
			<div className="border border-border rounded-lg overflow-hidden divide-y divide-border">
				<div className="bg-muted/50 px-3 py-2 font-bold text-sm text-center">
					ملخص المبيعات (Sales Summary)
				</div>
				<SummaryRow>
					<div>
						<SummaryRow.Label label="المبيعات (غير شامل الضريبة)"/>
						<SummaryRow.Label label="Sales (Tax Excl.)"/>
					</div>
					<SummaryRow.Value className="text-blue-600!" value={ formatNumber(data.pageSalesTaxExclusive) }/>
				</SummaryRow>
				<SummaryRow>
					<div>
						<SummaryRow.Label label="ضريبة المبيعات"/>
						<SummaryRow.Label label="Sales Tax"/>
					</div>
					<SummaryRow.Value className="text-red-600!" value={ formatNumber(data.pageSalesTax) }/>
				</SummaryRow>
			</div>

			<div className="border border-border rounded-lg overflow-hidden divide-y divide-border">
				<div className="bg-muted/50 px-3 py-2 font-bold text-sm text-center">
					ملخص المشتريات (Purchases Summary)
				</div>
				<SummaryRow>
					<div>
						<SummaryRow.Label label="المشتريات (غير شامل الضريبة)"/>
						<SummaryRow.Label label="Purchases (Tax Excl.)"/>
					</div>
					<SummaryRow.Value className="text-blue-600!"
					                  value={ formatNumber(data.pagePurchasesTaxExclusive) }/>
				</SummaryRow>
				<SummaryRow>
					<div>
						<SummaryRow.Label label="ضريبة المشتريات"/>
						<SummaryRow.Label label="Purchases Tax"/>
					</div>
					<SummaryRow.Value className="text-red-600!" value={ formatNumber(data.pagePurchasesTax) }/>
				</SummaryRow>
			</div>
		</div>
	);
}