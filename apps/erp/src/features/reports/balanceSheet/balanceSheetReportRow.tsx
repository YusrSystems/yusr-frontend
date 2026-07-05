import { formatNumber } from "@/features/report/utils/formating.ts";


interface BalanceSheetReportRowProps
{
	labelAr: string;
	labelEn: string;
	value: number;
}

export function BalanceSheetReportRow({labelAr, labelEn, value}: BalanceSheetReportRowProps)
{
	return (
		<div
			className="grid grid-cols-3 items-center gap-3 px-3 py-2 border-b border-border last:border-b-0 print:break-inside-avoid">
			<div>
				<p className="text-sm font-medium">{ labelAr }</p>
			</div>
			<div className="text-center font-bold">{ formatNumber(value) }</div>
			<div>
				<p className="text-sm font-medium" dir="ltr">{ labelEn }</p>
			</div>
		</div>
	);
}

BalanceSheetReportRow.SectionHeader = function SectionHeader({titleAr, titleEn}: { titleAr: string; titleEn: string })
{
	return (
		<div className="flex justify-between px-3 py-2 bg-accent rounded-t-md print:break-inside-avoid">
			<h3 className="font-extrabold text-primary">{ titleAr }</h3>
			<h3 className="font-extrabold text-primary" dir="ltr">{ titleEn }</h3>
		</div>
	);
};

BalanceSheetReportRow.Total = function Total({value}: { value: number })
{
	return (
		<div className="grid grid-cols-3 items-center gap-3 px-3 py-2 bg-muted/50 print:break-inside-avoid">
			<p className="text-sm font-bold">المجموع</p>
			<div className="text-center font-bold text-destructive!">{ formatNumber(value) }</div>
			<p className="text-sm font-bold" dir="ltr">Total</p>
		</div>
	);
};