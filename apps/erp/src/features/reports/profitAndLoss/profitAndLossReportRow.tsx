import { formatNumber } from "@/features/report/utils/formating.ts";
import type { PlReportNode } from "@/features/reports/profitAndLoss/profitAndLossReportResult.ts";


interface ProfitAndLossReportRowProps
{
	labelAr: string;
	labelEn: string;
	value: number;
	isBold?: boolean;
	valueClassName?: string;
}

export function ProfitAndLossReportRow({labelAr, labelEn, value, isBold, valueClassName}: ProfitAndLossReportRowProps)
{
	return (
		<div
			className={ `grid grid-cols-3 items-center gap-3 px-3 py-2 border-b border-border last:border-b-0 print:break-inside-avoid ${ isBold ? "bg-muted/10" : "" }` }>
			<div>
				<p className={ `text-sm ${ isBold ? "font-bold" : "font-medium" }` }>{ labelAr }</p>
			</div>
			<div className={ `text-center font-bold ${ valueClassName ?? "" }` }>{ formatNumber(value) }</div>
			<div>
				<p className={ `text-sm ${ isBold ? "font-bold" : "font-medium" }` } dir="ltr">{ labelEn }</p>
			</div>
		</div>
	);
}

export function ProfitAndLossTreeNode({node, level = 0}: { node: PlReportNode, level?: number })
{
	return (
		<>
			<div
				className={ `grid grid-cols-3 items-center gap-3 px-3 py-2 border-b border-border last:border-b-0 print:break-inside-avoid ${ node.isParent ? "bg-muted/10 font-bold" : "" }` }>
				<div className="flex items-center gap-2" style={ {paddingInlineStart: `${ level * 1.5 }rem`} }>
					<span className="text-xs text-muted-foreground">#{ node.glAccountId }</span>
					<p className="text-sm">{ node.name }</p>
				</div>
				<div className="text-center font-bold">{ formatNumber(node.netChange) }</div>
				<div>
					<p className="text-sm text-muted-foreground" dir="ltr">{ node.name }</p>
				</div>
			</div>
			{ node.children && node.children.length > 0 && (
				<div className="flex flex-col">
					{ node.children.map(child => (
						<ProfitAndLossTreeNode key={ child.glAccountId } node={ child } level={ level + 1 }/>
					)) }
				</div>
			) }
		</>
	);
}

ProfitAndLossReportRow.SectionHeader = function SectionHeader({titleAr, titleEn}: { titleAr: string; titleEn: string })
{
	return (
		<div className="flex justify-between px-3 py-2 bg-accent rounded-t-md print:break-inside-avoid">
			<h3 className="font-extrabold text-primary">{ titleAr }</h3>
			<h3 className="font-extrabold text-primary" dir="ltr">{ titleEn }</h3>
		</div>
	);
};

ProfitAndLossReportRow.Total = function Total({value, labelAr = "المجموع", labelEn = "Total"}: {
	value: number,
	labelAr?: string,
	labelEn?: string
})
{
	return (
		<div className="grid grid-cols-3 items-center gap-3 px-3 py-2 bg-muted/50 print:break-inside-avoid">
			<p className="text-sm font-bold">{ labelAr }</p>
			<div className="text-center font-bold text-destructive!">{ formatNumber(value) }</div>
			<p className="text-sm font-bold" dir="ltr">{ labelEn }</p>
		</div>
	);
};