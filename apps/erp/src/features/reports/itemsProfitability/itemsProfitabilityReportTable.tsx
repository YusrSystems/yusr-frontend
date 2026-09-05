import { ReportTableTh } from "@/features/report/components/reportTableTh";
import { ReportTableTd } from "@/features/report/components/reportTableTd";
import { formatNumber } from "@/features/report/utils/formating";
import { Cubits } from "@/core/services/cubits";
import { useSignals } from "@preact/signals-react/runtime";
import { ReportLoaded, ReportLoading, TablePreview } from "yusr-ui";
import { Link } from "react-router-dom";


const linkClassName = "p-0! text-blue-600! hover:bg-blue-100/50! hover:underline! print:text-foreground! print:no-underline! print:bg-transparent!";

export function ItemsProfitabilityReportTable()
{
	useSignals();

	if (Cubits.ItemsProfitabilityReport.state.value instanceof ReportLoading)
	{
		return <TablePreview.Loading/>;
	}

	if (Cubits.ItemsProfitabilityReport.state.value instanceof ReportLoaded)
	{
		const lines = Cubits.ItemsProfitabilityReport.result.value?.lines ?? [];

		return (
			<table className="w-full mt-5 border-collapse rounded-lg overflow-hidden">
				<thead>
				<tr>
					<ReportTableTh ar="الرقم" en="No."/>
					<ReportTableTh ar="رقم المادة" en="Item ID"/>
					<ReportTableTh ar="اسم المادة" en="Item Name" align="start"/>
					<ReportTableTh ar="العلامة التجارية" en="Brand" align="start"/>
					<ReportTableTh ar="التصنيف" en="Categories" align="start"/>
					<ReportTableTh ar="الوحدة" en="Unit"/>
					<ReportTableTh ar="الكمية المباعة" en="Sold Qty"/>
					<ReportTableTh ar="الكمية المرتجعة" en="Ret Qty"/>
					<ReportTableTh ar="صافي الكمية" en="Net Qty"/>
					<ReportTableTh ar="صافي المبيعات" en="Net Sales"/>
					<ReportTableTh ar="التكلفة" en="COGS"/>
					<ReportTableTh ar="إجمالي الربح" en="Gross Profit"/>
					<ReportTableTh ar="هامش الربح %" en="Margin %"/>
				</tr>
				</thead>
				<tbody>
				{ lines.map((row, idx) =>
				{
					const isEven = idx % 2 === 0;
					const profitColorClass = row.profitAmount >= 0 ? "text-emerald-600! font-bold!" : "text-destructive! font-bold!";

					return (
						<tr key={ `${ row.itemId }-${ idx }` }>
							<ReportTableTd isEven={ isEven }>
								{ idx + 1 + (((Cubits.ItemsProfitabilityReport.result.value?.pageNumber ?? 1) - 1) * (Cubits.ItemsProfitabilityReport.result.value?.rowsPerPage ?? 100)) }
							</ReportTableTd>
							<ReportTableTd isEven={ isEven } className={ linkClassName }>
								<Link
									to={ `/items/${ row.itemId }` }
									target="_blank"
									rel="noopener noreferrer"
									className="block w-full h-full p-2"
								>
									{ row.itemId }
								</Link>
							</ReportTableTd>
							<ReportTableTd isEven={ isEven } align="start" className="font-semibold">
								{ row.itemName }
							</ReportTableTd>
							<ReportTableTd isEven={ isEven } align="start">
								{ row.itemBrand || "-" }
							</ReportTableTd>
							<ReportTableTd isEven={ isEven } align="start" className="text-xs text-muted-foreground">
								{ row.categories?.join(", ") || "-" }
							</ReportTableTd>
							<ReportTableTd isEven={ isEven }>
								{ row.baseUnitName }
							</ReportTableTd>
							<ReportTableTd isEven={ isEven }>
								{ formatNumber(row.soldQuantity) }
							</ReportTableTd>
							<ReportTableTd isEven={ isEven }
							               className={ row.returnedQuantity > 0 ? "text-orange-600 font-semibold" : "" }>
								{ row.returnedQuantity > 0 ? formatNumber(row.returnedQuantity) : "-" }
							</ReportTableTd>
							<ReportTableTd isEven={ isEven } className="font-semibold">
								{ formatNumber(row.netQuantity) }
							</ReportTableTd>
							<ReportTableTd isEven={ isEven } className="text-blue-600! font-semibold">
								{ formatNumber(row.salesAmount) }
							</ReportTableTd>
							<ReportTableTd isEven={ isEven } className="text-orange-600! font-semibold">
								{ formatNumber(row.cogsAmount) }
							</ReportTableTd>
							<ReportTableTd isEven={ isEven } className={ profitColorClass }>
								{ formatNumber(row.profitAmount) }
							</ReportTableTd>
							<ReportTableTd isEven={ isEven } className={ profitColorClass }>
								{ formatNumber(row.marginPercentage) }%
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