import type { PropsWithChildren } from "react";


export function ReportPageBody({children}: PropsWithChildren)
{
	return (
		<tbody>
		<tr>
			<td className="p-0">
				{ children }
			</td>
		</tr>
		</tbody>
	);
}