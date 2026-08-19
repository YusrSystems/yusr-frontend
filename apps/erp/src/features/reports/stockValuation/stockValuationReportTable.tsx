import { useSignals } from "@preact/signals-react/runtime";
import { Cubits } from "@/core/services/cubits.ts";
import { ReportTableTh } from "@/features/report/components/reportTableTh.tsx";
import { ReportTableTd } from "@/features/report/components/reportTableTd.tsx";
import { formatNumber } from "@/features/report/utils/formating.ts";
import { ReportError, ReportLoaded, ReportLoading, TablePreview } from "yusr-ui";
import { Link } from "react-router-dom";


export function StockValuationReportTable()
{
	useSignals();

	if (Cubits.stockValuationReport.state.value instanceof ReportLoading)
	{
		return <TablePreview.Loading/>;
	}

	if (Cubits.stockValuationReport.state.value instanceof ReportError)
	{
		return <TablePreview.Error/>;
	}

	if (Cubits.stockValuationReport.state.value instanceof ReportLoaded)
	{
		const result = Cubits.stockValuationReport.result.value;
		const lines = result?.lines ?? [];

		if (lines.length === 0)
		{
			return <TablePreview.Empty/>;
		}

		return (
			<table className="w-full mt-5 border-collapse rounded-lg overflow-hidden">
				<thead>
				<tr>
					<ReportTableTh ar="الرقم" en="No."/>
					<ReportTableTh ar="رقم المادة" en="Item ID"/>
					<ReportTableTh ar="اسم المادة" en="Item Name" align="start"/>
					<ReportTableTh ar="التصنيف" en="Category" align="start"/>
					<ReportTableTh ar="العلامة التجارية" en="Brand" align="start"/>
					<ReportTableTh ar="الوحدة" en="Base Unit" align="start"/>
					<ReportTableTh ar="المستودع" en="Store" align="start"/>
					<ReportTableTh ar="الكمية" en="Qty On Hand"/>
					<ReportTableTh ar="متوسط التكلفة" en="Avg Cost"/>
					<ReportTableTh ar="إجمالي القيمة" en="Total Value"/>
				</tr>
				</thead>
				<tbody>
				{ lines.map((line, idx) =>
				{
					const isEven = idx % 2 === 0;

					return (
						<tr key={ `${ line.itemId }-${ idx }` }>
							<ReportTableTd isEven={ isEven }>
								{ idx + 1 + ((result?.pageNumber ?? 1) - 1) * (result?.rowsPerPage ?? 100) }
							</ReportTableTd>

							<ReportTableTd
								isEven={ isEven }
								className="p-0! text-blue-600! hover:bg-blue-100/50! hover:underline! print:text-foreground! print:no-underline! print:bg-transparent!"
							>
								<Link
									to={ `/items/${ line.itemId }` }
									target="_blank"
									rel="noopener noreferrer"
									className="block w-full h-full p-3"
								>
									{ line.itemId }
								</Link>
							</ReportTableTd>

							<ReportTableTd isEven={ isEven } align="start">
								{ line.itemName }
							</ReportTableTd>

							<ReportTableTd isEven={ isEven } align="start">
								{ line.categories?.join(" - ") || "-" }
							</ReportTableTd>

							<ReportTableTd isEven={ isEven } align="start">
								{ line.itemBrand || "-" }
							</ReportTableTd>

							<ReportTableTd isEven={ isEven } align="start">
								{ line.baseUnitName }
							</ReportTableTd>

							<ReportTableTd isEven={ isEven } align="start">
								{ line.storeName }
							</ReportTableTd>

							<ReportTableTd isEven={ isEven }>
								{ formatNumber(line.quantityOnHand) }
							</ReportTableTd>

							<ReportTableTd isEven={ isEven }>
								{ formatNumber(line.averageCost) }
							</ReportTableTd>

							<ReportTableTd isEven={ isEven } className="font-bold">
								{ formatNumber(line.totalValuation) }
							</ReportTableTd>
						</tr>
					);
				}) }
				</tbody>
			</table>
		);
	}

	return <TablePreview.Empty/>;
}