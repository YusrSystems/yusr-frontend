import { ReportTableTh } from "@/features/report/components/reportTableTh.tsx";
import { ReportTableTd } from "@/features/report/components/reportTableTd.tsx";
import { formatNumber } from "@/features/report/utils/formating.ts";
import { Cubits } from "@/core/services/cubits.ts";
import { useSignals } from "@preact/signals-react/runtime";
import { ReportLoaded, ReportLoading, TablePreview } from "yusr-ui";
import { Link } from "react-router-dom";
import { getDocumentRoute, getDocumentTypeName } from "@/core/types/documentType.ts";


const linkClassName = "text-blue-600! hover:bg-blue-100/50! hover:underline! print:text-foreground! print:no-underline! print:bg-transparent!";

export function ItemsMovementReportTable()
{
	useSignals();

	if (Cubits.ItemsMovementReport.state.value instanceof ReportLoading)
	{
		return <TablePreview.Loading/>;
	}

	if (Cubits.ItemsMovementReport.state.value instanceof ReportLoaded)
	{
		const lines = Cubits.ItemsMovementReport.result.value?.lines ?? [];

		return (
			<table className="w-full mt-5 border-collapse rounded-lg overflow-hidden">
				<thead>
				<tr>
					<ReportTableTh ar="التاريخ" en="Date"/>
					<ReportTableTh ar="نوع المستند" en="Doc Type"/>
					<ReportTableTh ar="رقم المستند" en="Doc No."/>
					<ReportTableTh ar="اسم المادة" en="Item Name" align="start"/>
					<ReportTableTh ar="المستودع" en="Store" align="start"/>
					<ReportTableTh ar="الجهة" en="Partner" align="start"/>
					<ReportTableTh ar="الوارد (+)" en="Qty In"/>
					<ReportTableTh ar="الصادر (-)" en="Qty Out"/>
					<ReportTableTh ar="التكلفة" en="Unit Cost"/>
					<ReportTableTh ar="القيمة" en="Value"/>
				</tr>
				</thead>
				<tbody>
				{ lines.map((row, idx) =>
				{
					const isEven = idx % 2 === 0;
					const routePath = getDocumentRoute(row.documentType);

					return (
						<tr key={ `${ row.id }-${ idx }` }>
							<ReportTableTd className="min-w-20" isEven={ isEven }>{ row.date }</ReportTableTd>
							<ReportTableTd isEven={ isEven }>{ getDocumentTypeName(row.documentType) }</ReportTableTd>

							{ routePath ? (
								<ReportTableTd isEven={ isEven } className={ linkClassName }>
									<Link
										to={ `/${ routePath }/${ row.documentId }` }
										target="_blank"
										rel="noopener noreferrer"
										className="block w-full h-full"
									>
										{ row.documentId }
									</Link>
								</ReportTableTd>
							) : (
								<ReportTableTd isEven={ isEven }>{ row.documentId || "-" }</ReportTableTd>
							) }

							<ReportTableTd isEven={ isEven } align="start" className={ linkClassName }>
								<Link
									to={ `/items/${ row.itemId }` }
									target="_blank"
									rel="noopener noreferrer"
									className="block w-full h-full"
								>
									{ row.itemName }
								</Link>
							</ReportTableTd>
							<ReportTableTd isEven={ isEven } align="start">{ row.storeName }</ReportTableTd>
							<ReportTableTd isEven={ isEven } align="start">{ row.partnerName || "-" }</ReportTableTd>

							<ReportTableTd isEven={ isEven }
							               className={ row.quantityIn > 0 ? "text-green-600! font-semibold!" : "text-muted-foreground!" }>
								{ row.quantityIn > 0 ? formatNumber(row.quantityIn) : "-" }
							</ReportTableTd>
							<ReportTableTd isEven={ isEven }
							               className={ row.quantityOut > 0 ? "text-red-600! font-semibold!" : "text-muted-foreground!" }>
								{ row.quantityOut > 0 ? formatNumber(row.quantityOut) : "-" }
							</ReportTableTd>

							<ReportTableTd isEven={ isEven }>{ formatNumber(row.unitCost) }</ReportTableTd>
							<ReportTableTd isEven={ isEven }>{ formatNumber(row.value) }</ReportTableTd>
						</tr>
					);
				}) }
				</tbody>
			</table>
		);
	}

	return <TablePreview.Empty/>;
}