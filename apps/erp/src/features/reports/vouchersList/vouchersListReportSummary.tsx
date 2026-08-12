import { SummaryRow } from "@/features/report/components/summaryRow.tsx";
import { useSignals } from "@preact/signals-react/runtime";
import { Cubits } from "@/core/services/cubits.ts";
import { formatNumber } from "@/features/report/utils/formating.ts";
import { VoucherType } from "@/core/data/voucher.ts";


export function VouchersListReportSummary()
{
	useSignals();
	const vouchers = Cubits.vouchers.entities.value;
	const count = vouchers.length;
	let totalAmount = 0;
	let totalReceipts = 0;
	let totalPayments = 0;

	vouchers.forEach((voucher) =>
	{
		const amount = voucher.amount || 0;
		totalAmount += amount;
		if (voucher.type === VoucherType.Receipt)
		{
			totalReceipts += amount;
		}
		else if (voucher.type === VoucherType.Payment)
		{
			totalPayments += amount;
		}
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
					<SummaryRow.Label label="مجموع المقبوضات"/>
					<SummaryRow.Label label="Total receipts"/>
				</div>
				<SummaryRow.Value className="text-green-600!" value={ formatNumber(totalReceipts) }/>
			</SummaryRow>
			<SummaryRow>
				<div>
					<SummaryRow.Label label="مجموع المدفوعات"/>
					<SummaryRow.Label label="Total payments"/>
				</div>
				<SummaryRow.Value className="text-red-600!" value={ formatNumber(totalPayments) }/>
			</SummaryRow>
			<SummaryRow className="bg-muted/50">
				<div>
					<SummaryRow.Label label="إجمالي المبالغ"/>
					<SummaryRow.Label label="Total amount"/>
				</div>
				<SummaryRow.Value value={ formatNumber(totalAmount) }/>
			</SummaryRow>
		</div>
	);
}