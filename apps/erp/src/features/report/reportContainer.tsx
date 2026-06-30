import type { PropsWithChildren } from "react";


export function ReportContainer({children}: PropsWithChildren)
{
	return (
		<div
			className="max-w-5xl w-full mx-auto bg-card text-card-foreground shadow-sm border border-border rounded-lg p-10 print:p-0 print:shadow-none print:border-none print:max-w-none relative"
		>
			{ children }
		</div>
	);
}