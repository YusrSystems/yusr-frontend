import { formatNumber } from "@/features/report/utils/formating";


interface VatReturnReportRowProps
{
	labelAr: string;
	amount: number;
	amendment: number;
}

export function VatReturnReportRow({labelAr, amount, amendment}: VatReturnReportRowProps)
{
	return (
		<div
			className="grid grid-cols-3 items-center gap-3 px-3 py-2 border-b border-border last:border-b-0 print:break-inside-avoid">
			<div>
				<p className="text-sm font-medium">{ labelAr }</p>
			</div>
			<div className="text-center font-bold">{ formatNumber(amount) }</div>
			<div className="text-center font-bold">{ formatNumber(amendment) }</div>
		</div>
	);
}

VatReturnReportRow.SectionHeader = function SectionHeader({titleAr}: { titleAr: string })
{
	return (
		<div className="print:break-inside-avoid">
			<div className="flex justify-between px-3 py-2 bg-accent rounded-t-md">
				<h3 className="font-extrabold text-primary">{ titleAr }</h3>
			</div>
			<div className="grid grid-cols-3 gap-3 px-3 py-1.5 bg-muted text-xs font-bold text-muted-foreground">
				<span/>
				<span className="text-center">المبلغ</span>
				<span className="text-center">مبلغ التعديل</span>
			</div>
		</div>
	);
};