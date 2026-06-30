import type { PropsWithChildren } from "react";


export default function ReportPageFooter({children}: PropsWithChildren)
{
	return (
		<tfoot className="table-footer-group report-page-footer-row">
		<tr>
			<td className="p-0 pt-4">
				{ children }
			</td>
		</tr>
		</tfoot>
	);
}