export function ReportTableTd({children, isEven, align = "center"}: {
	children: React.ReactNode;
	isEven: boolean;
	align?: "center" | "start"
})
{
	return (
		<td
			className={ `border border-border p-1.5 text-[8pt] text-foreground print:break-inside-avoid ${
				isEven ? "bg-muted/50" : "bg-background"
			} ${ align === "start" ? "text-start" : "text-center" }` }
		>
			{ children }
		</td>
	);
}