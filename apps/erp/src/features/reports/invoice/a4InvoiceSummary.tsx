import type { CommercialReportResult } from "./invoiceReportResult";
import { SummaryRow } from "@/features/report/components/summaryRow";
import { formatNumber } from "@/features/report/utils/formating";


export function A4InvoiceSummary({data}: { data: CommercialReportResult })
{
	const labelClassName = "text-[10px]! max-w-40! w-40!";
	const valueClassName = "flex-1 text-[14px] text-center font-bold";
	const isInvoice = "paidAmount" in data;

	return (
		<div className="max-w-md mt-2 border border-border rounded-lg overflow-hidden ms-auto divide-y divide-border">
			{ data.settlementAmount > 0 && (
				<SummaryRow>
					<div>
						<SummaryRow.Label className={ labelClassName } label="مبلغ التسوية"/>
						<SummaryRow.Label className={ labelClassName } label="Settlement Amount"/>
					</div>
					<SummaryRow.Value className={ valueClassName } value={ formatNumber(data.settlementAmount) }/>
				</SummaryRow>
			) }
			{ data.settlementPercent > 0 && (
				<SummaryRow>
					<div>
						<SummaryRow.Label className={ labelClassName } label="نسبة التسوية"/>
						<SummaryRow.Label className={ labelClassName } label="Settlement Percent"/>
					</div>
					<SummaryRow.Value className={ valueClassName } value={ formatNumber(data.settlementPercent) }/>
				</SummaryRow>
			) }
			{ data.settlementReason && (
				<SummaryRow>
					<div>
						<SummaryRow.Label className={ labelClassName } label="سبب التسوية"/>
						<SummaryRow.Label className={ labelClassName } label="Settlement Reason"/>
					</div>
					<SummaryRow.Value className={ `${ valueClassName } text-[10px]!` } value={ data.settlementReason }/>
				</SummaryRow>
			) }
			<SummaryRow>
				<div>
					<SummaryRow.Label className={ labelClassName } label="الإجمالي قبل الضريبة"/>
					<SummaryRow.Label className={ labelClassName } label="Total Before Tax"/>
				</div>
				<SummaryRow.Value className={ valueClassName } value={ formatNumber(data.totalBeforeTax) }/>
			</SummaryRow>
			<SummaryRow>
				<div>
					<SummaryRow.Label className={ labelClassName } label="قيمة الضريبة"/>
					<SummaryRow.Label className={ labelClassName } label="Tax Amount"/>
				</div>
				<SummaryRow.Value className={ valueClassName } value={ formatNumber(data.totalTaxAmount) }/>
			</SummaryRow>
			<SummaryRow>
				<div>
					<SummaryRow.Label className={ labelClassName } label="الإجمالي بعد الضريبة"/>
					<SummaryRow.Label className={ labelClassName } label="Total After Tax"/>
				</div>
				<SummaryRow.Value className={ `${ valueClassName } text-base!` }
				                  value={ formatNumber(data.totalAfterTax) }/>
			</SummaryRow>
			{ isInvoice && (
				<>
					<SummaryRow>
						<div>
							<SummaryRow.Label className={ labelClassName } label="المبلغ المدفوع"/>
							<SummaryRow.Label className={ labelClassName } label="Paid Amount"/>
						</div>
						<SummaryRow.Value className={ `${ valueClassName } text-green-600` }
						                  value={ formatNumber((data as { paidAmount: number }).paidAmount) }/>
					</SummaryRow>
					<SummaryRow>
						<div>
							<SummaryRow.Label className={ labelClassName } label="المتبقي من الفاتورة"/>
							<SummaryRow.Label className={ labelClassName } label="Remain Amount"/>
						</div>
						<SummaryRow.Value className={ `${ valueClassName } text-red-600` }
						                  value={ formatNumber((data as {
							                  remainingAmount: number
						                  }).remainingAmount) }/>
					</SummaryRow>
				</>
			) }
		</div>
	);
}