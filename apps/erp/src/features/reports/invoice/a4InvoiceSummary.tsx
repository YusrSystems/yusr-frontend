import { formatNumber } from "@/features/report/utils/formating";
import type { InvoiceReportResult } from "./invoiceReportResult";


export function A4InvoiceSummary({data}: { data: InvoiceReportResult })
{
	return (
		<div className="w-50 border border-border rounded-lg overflow-hidden flex flex-col shrink-0">
			{ data.settlementAmount > 0 && (
				<SummaryRow labelAr="مبلغ التسوية" labelEn="Settlement Amount" value={ data.settlementAmount }/>
			) }

			{ data.settlementPercent > 0 && (
				<SummaryRow labelAr="نسبة التسوية" labelEn="Settlement Percent" value={ data.settlementPercent }
				            isPercent/>
			) }

			{ data.settlementReason && (
				<div className="flex justify-between p-2 border-b border-border text-xs">
					<div className="flex flex-col">
						<span className="font-semibold">سبب التسوية</span>
						<span className="text-[9px] text-muted-foreground" dir="ltr">Settlement Reason</span>
					</div>
					<span
						className="font-bold self-center text-left max-w-[50%] text-sm">{ data.settlementReason }</span>
				</div>
			) }

			<SummaryRow labelAr="الإجمالي قبل الضريبة" labelEn="Total Before Tax" value={ data.totalBeforeTax }/>

			<SummaryRow labelAr="قيمة الضريبة" labelEn="Tax Amount" value={ data.totalTaxAmount }/>

			<div className="flex justify-between p-2.5 bg-muted/50 border-b border-border">
				<div className="flex flex-col">
					<span className="font-bold text-primary text-xs">الإجمالي بعد الضريبة</span>
					<span className="text-[9px] text-primary" dir="ltr">Total After Tax</span>
				</div>
				<span
					className="font-extrabold text-primary self-center text-lg">{ formatNumber(data.totalAfterTax) }</span>
			</div>

			<SummaryRow labelAr="المبلغ المدفوع" labelEn="Paid Amount" value={ data.paidAmount }
			            valueClass="text-green-600"/>

			<SummaryRow labelAr="المتبقي من الفاتورة" labelEn="Remain Amount" value={ data.remainingAmount }
			            valueClass="text-red-600" hideBorder/>
		</div>
	);
}

function SummaryRow({
	labelAr,
	labelEn,
	value,
	isPercent,
	valueClass,
	hideBorder
}: {
	labelAr: string,
	labelEn: string,
	value: number,
	isPercent?: boolean,
	valueClass?: string,
	hideBorder?: boolean
})
{
	return (
		<div className={ `flex justify-between p-2 ${ hideBorder ? "" : "border-b border-border" } text-xs` }>
			<div className="flex flex-col">
				<span className="font-semibold">{ labelAr }</span>
				<span className="text-[9px] text-muted-foreground" dir="ltr">{ labelEn }</span>
			</div>
			<span className={ `font-bold self-center text-sm ${ valueClass || "" }` }>
				{ formatNumber(value) }{ isPercent ? "%" : "" }
			</span>
		</div>
	);
}