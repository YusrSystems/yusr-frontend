import { SummaryRow } from "@/features/report/components/summaryRow";
import { useSignals } from "@preact/signals-react/runtime";
import { formatNumber } from "@/features/report/utils/formating";
import type { ICommercialInvoiceDocumentDto } from "@/core/data/commercial/commercialInvoiceDocument";


export function InvoicesListReportSummary({invoices}: { invoices: ICommercialInvoiceDocumentDto[] })
{
	useSignals();
	const count = invoices.length;

	let totalAmount = 0;
	let totalPaidAmount = 0;

	invoices.forEach((invoice) =>
	{
		totalAmount += invoice.fullAmount || 0;
		totalPaidAmount += invoice.paidAmount || 0;
	});

	return (
		<div className="max-w-md my-3 border border-border rounded-lg overflow-hidden ms-auto divide-y divide-border">
			<SummaryRow>
				<div>
					<SummaryRow.Label label="العدد"/>
					<SummaryRow.Label label="Count"/>
				</div>
				<SummaryRow.Value value={ formatNumber(count) }/>
			</SummaryRow>

			<SummaryRow>
				<div>
					<SummaryRow.Label label="مجموع المبلغ"/>
					<SummaryRow.Label label="Total amount"/>
				</div>
				<SummaryRow.Value value={ formatNumber(totalAmount) }/>
			</SummaryRow>

			<SummaryRow>
				<div>
					<SummaryRow.Label label="مجموع المبلغ المدفوع"/>
					<SummaryRow.Label label="Total paid amount"/>
				</div>
				<SummaryRow.Value value={ formatNumber(totalPaidAmount) }/>
			</SummaryRow>
		</div>
	);
}