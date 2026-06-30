import type { PropsWithChildren } from "react";


export default function ReportPageHeader({children}: PropsWithChildren)
{
	return (
		<thead className="table-header-group">
		<tr>
			<td className="p-0 pb-4">
				{ children }
			</td>
		</tr>
		</thead>
	);
}