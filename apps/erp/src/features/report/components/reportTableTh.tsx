export function ReportTableTh({ar, en}: { ar: string; en: string; align?: "center" | "start" })
{
	return (
		<th className="border border-border bg-muted p-1.5 text-[7pt] font-bold text-foreground leading-tight text-right">
			<div>{ ar }</div>
			<div className="text-right" dir="ltr">{ en }</div>
		</th>
	);
}
