interface SummaryRowProps
{
	labelAr: string;
	labelEn: string;
	value: string;
	isLast?: boolean;
	isHighlighted?: boolean;
}

function SummaryRow({labelAr, labelEn, value, isLast = false, isHighlighted = false}: SummaryRowProps)
{
	return (
		<>
			<div className={ `flex items-center ${ isHighlighted ? "bg-muted" : "bg-background" }` }>
				<div className="w-20 shrink-0 px-1.5 py-0.5">
					<div className="text-[6pt] font-bold text-foreground">{ labelAr }</div>
					<div className="text-[6pt] text-foreground">{ labelEn }</div>
				</div>
				<div
					className={ `flex-1 text-center font-bold text-foreground ${ isHighlighted ? "text-[9pt]" : "text-[7pt]" }` }>
					{ value }
				</div>
			</div>
			{ !isLast && <div className="h-px bg-border"/> }
		</>
	);
}

export interface InvoiceSummaryData
{
	settlementAmount?: number;
	settlementPercent?: number;
	settlementReason?: string;
	paidAmount: number;
	remainAmount: number;
	totalBeforeTax: number;
	taxAmount: number;
	totalAfterTax: number;
}

const numberFmt = (n: number) => n.toLocaleString("en-US", {minimumFractionDigits: 2, maximumFractionDigits: 2});

export function ReportInvoiceSummary({data}: { data: InvoiceSummaryData })
{
	const rows: SummaryRowProps[] = [];

	if (data.settlementAmount)
	{
		rows.push({labelAr: "مبلغ التسوية", labelEn: "Settlement Amount", value: numberFmt(data.settlementAmount)});
	}
	if (data.settlementPercent)
	{
		rows.push({
			labelAr: "نسبة التسوية",
			labelEn: "Settlement Percent",
			value: `${ numberFmt(data.settlementPercent) }%`
		});
	}
	if (data.settlementReason)
	{
		rows.push({labelAr: "سبب التسوية", labelEn: "Settlement Reason", value: data.settlementReason});
	}

	rows.push(
		{labelAr: "المبلغ المدفوع", labelEn: "Paid Amount", value: numberFmt(data.paidAmount)},
		{labelAr: "المتبقي من الفاتورة", labelEn: "Remain Amount", value: numberFmt(data.remainAmount)},
		{labelAr: "الإجمالي قبل الضريبة", labelEn: "Total Before Tax", value: numberFmt(data.totalBeforeTax)},
		{labelAr: "قيمة الضريبة", labelEn: "Tax Amount", value: numberFmt(data.taxAmount)},
		{
			labelAr: "الإجمالي بعد الضريبة",
			labelEn: "Total After Tax",
			value: numberFmt(data.totalAfterTax),
			isHighlighted: true
		}
	);

	return (
		<div className="w-[200px] border border-border rounded-[5px] overflow-hidden ms-auto print:break-inside-avoid">
			{ rows.map((row, idx) => (
				<SummaryRow key={ row.labelEn } { ...row } isLast={ idx === rows.length - 1 }/>
			)) }
		</div>
	);
}