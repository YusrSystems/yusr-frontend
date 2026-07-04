import type { PropsWithChildren } from "react";


export function ReportPageContainer({children}: PropsWithChildren)
{
	return (
		<table className="w-full">
			{ children }
		</table>
	);
}