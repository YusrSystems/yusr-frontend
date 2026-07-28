import { ReportTableTh } from "@/features/report/components/reportTableTh.tsx";
import { ReportTableTd } from "@/features/report/components/reportTableTd.tsx";
import { formatNumber } from "@/features/report/utils/formating.ts";
import { Cubits } from "@/core/services/cubits.ts";
import { useSignals } from "@preact/signals-react/runtime";
import { ReportLoaded, ReportLoading, TablePreview } from "yusr-ui";
import { Link } from "react-router-dom";
import { getDocumentRoute, getDocumentTypeName } from "@/core/types/documentType.ts";


const linkClassName = "text-blue-600! hover:bg-blue-100/50! hover:underline! print:text-foreground! print:no-underline! print:bg-transparent!";

export function ItemStatementReportTable()
{
	useSignals();

	if (Cubits.ItemStatementReport.state.value instanceof ReportLoading)
	{
		return <TablePreview.Loading/>;
	}

	if (Cubits.ItemStatementReport.state.value instanceof ReportLoaded)
	{
		const result = Cubits.ItemStatementReport.result.value;
		const lines = result?.lines ?? [];

		return (
			<table className="w-full mt-5 border-collapse rounded-lg overflow-hidden">
				<thead>
				<tr>
					<ReportTableTh ar="التاريخ" en="Date"/>
					<ReportTableTh ar="نوع المستند" en="Document Type"/>
					<ReportTableTh ar="رقم المستند" en="Doc No."/>
					<ReportTableTh ar="المستودع" en="Store" align="start"/>
					<ReportTableTh ar="الحساب / الطرف المقابل" en="Partner / Counterparty" align="start"/>
					<ReportTableTh ar="الوارد (+)" en="Qty In"/>
					<ReportTableTh ar="الصادر (-)" en="Qty Out"/>
					<ReportTableTh ar="الرصيد الجاري" en="Running Qty"/>
					<ReportTableTh ar="التكلفة للوحدة" en="Unit Cost"/>
				</tr>
				</thead>
				<tbody>
				{ lines.map((line, idx) =>
				{
					const isEven = idx % 2 === 0;
					const routePath = getDocumentRoute(line.documentType);

					return (
						<tr key={ `${ line.id }-${ idx }` }>
							<ReportTableTd isEven={ isEven }>{ line.date }</ReportTableTd>
							<ReportTableTd isEven={ isEven }>
								{ getDocumentTypeName(line.documentType) }
							</ReportTableTd>

							{ routePath ? (
								<ReportTableTd isEven={ isEven } className={ linkClassName }>
									<Link
										to={ `/${ routePath }/${ line.documentId }` }
										target="_blank"
										rel="noopener noreferrer"
										className="block w-full h-full"
									>
										{ line.documentId }
									</Link>
								</ReportTableTd>
							) : (
								<ReportTableTd isEven={ isEven }>{ line.documentId || "-" }</ReportTableTd>
							) }

							<ReportTableTd isEven={ isEven } align="start">{ line.storeName || "-" }</ReportTableTd>
							<ReportTableTd isEven={ isEven }
							               align="start">{ line.secondPartyName || "-" }</ReportTableTd>

							<ReportTableTd isEven={ isEven }
							               className={ line.quantityIn > 0 ? "text-green-600! font-semibold!" : "text-muted-foreground!" }>
								{ line.quantityIn > 0 ? formatNumber(line.quantityIn) : "-" }
							</ReportTableTd>

							<ReportTableTd isEven={ isEven }
							               className={ line.quantityOut > 0 ? "text-red-600! font-semibold!" : "text-muted-foreground!" }>
								{ line.quantityOut > 0 ? formatNumber(line.quantityOut) : "-" }
							</ReportTableTd>

							<ReportTableTd
								isEven={ isEven }
								className={ line.runningQuantity > 0 ? "text-green-600! font-semibold!" : "text-red-600!" }>
								{ formatNumber(line.runningQuantity) }
							</ReportTableTd>
							<ReportTableTd isEven={ isEven }>{ formatNumber(line.unitCost) }</ReportTableTd>
						</tr>
					);
				}) }

				{ result && lines.length > 0 && (
					<tr className="border-t-2 border-border font-bold bg-muted/40">
						<td colSpan={ 5 } className="p-3 text-start font-extrabold text-xs">
							المجموع (Totals):
						</td>
						<td className="p-3 text-center text-green-600!">{ formatNumber(result.pageTotalQuantityIn) }</td>
						<td className="p-3 text-center text-red-600!">{ formatNumber(result.pageTotalQuantityOut) }</td>
						<td colSpan={ 2 } className="p-3"/>
					</tr>
				) }
				</tbody>
			</table>
		);
	}

	return <TablePreview.Empty/>;
}