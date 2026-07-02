import { ReportTableTh } from "@/features/report/components/reportTableTh.tsx";
import { ReportTableTd } from "@/features/report/components/reportTableTd.tsx";
import { formatNumber } from "@/features/report/utils/formating.ts";
import { ItemsMovementReportType } from "@/features/reports/itemsMovement/itemsMovementReportResult.ts";
import { Cubits } from "@/core/services/cubits.ts";
import { useSignals } from "@preact/signals-react/runtime";
import { ReportLoaded, ReportLoading, TablePreview } from "yusr-ui";
import { Link } from "react-router-dom";


export function ItemsMovementReportTable()
{
	useSignals();

	if (Cubits.ItemsMovementReport.state.value instanceof ReportLoading)
	{
		return <TablePreview.Loading/>;
	}

	if (Cubits.ItemsMovementReport.state.value instanceof ReportLoaded)
	{
		if (Cubits.ItemsMovementReport.result.value?.reportType === ItemsMovementReportType.ItemsMovement)
		{
			return (
				<table className="w-full mt-5 border-collapse rounded-lg overflow-hidden">
					<thead>
					<tr>
						<ReportTableTh ar="التاريخ" en="Date"/>
						<ReportTableTh ar="نوع العملية" en="Trans type"/>
						<ReportTableTh ar="رقم العملية" en="Trans id"/>
						<ReportTableTh ar="اسم المادة" en="Item name"/>
						<ReportTableTh ar="الكمية" en="Quantity"/>
						<ReportTableTh ar="التكلفة" en="Cost"/>
						<ReportTableTh ar="السعر" en="Price"/>
						<ReportTableTh ar="الربح" en="Profit"/>
						<ReportTableTh ar="من" en="From"/>
						<ReportTableTh ar="إلى" en="To"/>
					</tr>
					</thead>
					<tbody>
					{ Cubits.ItemsMovementReport.result.value.itemsMovementRows.map((row, idx) =>
					{
						const isEven = idx % 2 === 0;
						return (
							<tr key={ row.id }>
								<ReportTableTd isEven={ isEven }>{ row.transDate }</ReportTableTd>
								<ReportTableTd isEven={ isEven }>{ row.transType }</ReportTableTd>
								<ReportTableTd isEven={ isEven }
								               className="p-0! text-blue-600! hover:bg-blue-100/50! hover:underline! print:text-foreground! print:no-underline! print:bg-transparent!">
									<Link
										to={ `/${
											row.transType === "مرتجع بيع" || row.transType === "بيع"
												? "sales"
												: row.transType === "شراء" || row.transType === "مرتجع شراء"
													? "purchases"
													: row.transType === "نقل" ? "itemTransfers" : "itemsSettlements"
										}/${ row.transId }` }
										target="_blank"
										rel="noopener noreferrer"
										className="block w-full h-full"
									>
										{ row.transId }
									</Link>
								</ReportTableTd>
								<ReportTableTd isEven={ isEven }
								               className="p-0! text-blue-600! hover:bg-blue-100/50! hover:underline! print:text-foreground! print:no-underline! print:bg-transparent!">
									<Link
										to={ `/items/${ row.itemId }` }
										target="_blank"
										rel="noopener noreferrer"
										className="block w-full h-full"
									>
										{ row.itemName }
									</Link>
								</ReportTableTd>
								<ReportTableTd isEven={ isEven }>{ formatNumber(row.quantity) }</ReportTableTd>
								<ReportTableTd isEven={ isEven }>{ formatNumber(row.cost) }</ReportTableTd>
								<ReportTableTd isEven={ isEven }>{ formatNumber(row.price) }</ReportTableTd>
								<ReportTableTd isEven={ isEven }>{ formatNumber(row.profit) }</ReportTableTd>
								<ReportTableTd isEven={ isEven } align="start">{ row.from }</ReportTableTd>
								<ReportTableTd isEven={ isEven } align="start">{ row.to }</ReportTableTd>
							</tr>
						);
					}) }
					</tbody>
				</table>
			);
		}

		return (
			<table className="w-full mt-5 border-collapse rounded-lg overflow-hidden">
				<thead>
				<tr>
					<ReportTableTh ar="الرقم" en="No."/>
					<ReportTableTh ar={ Cubits.ItemsMovementReport.result.value?.tableFieldTitleAr ?? "" }
					               en={ Cubits.ItemsMovementReport.result.value?.tableFieldTitleEn ?? "" }/>
					<ReportTableTh ar="الكمية" en="Quantity"/>
					<ReportTableTh ar="التكلفة" en="Cost"/>
					<ReportTableTh ar="السعر" en="Price"/>
					<ReportTableTh ar="الربح" en="Profit"/>
				</tr>
				</thead>
				<tbody>
				{ Cubits.ItemsMovementReport.result.value?.itemsMovementRows.map((row, idx) =>
				{
					const isEven = idx % 2 === 0;
					return (
						<tr key={ row.id }>
							<ReportTableTd isEven={ isEven }>{ row.id }</ReportTableTd>
							<ReportTableTd isEven={ isEven } align="start">{ row.groupField }</ReportTableTd>
							<ReportTableTd isEven={ isEven }>{ formatNumber(row.quantity) }</ReportTableTd>
							<ReportTableTd isEven={ isEven }>{ formatNumber(row.cost) }</ReportTableTd>
							<ReportTableTd isEven={ isEven }>{ formatNumber(row.price) }</ReportTableTd>
							<ReportTableTd isEven={ isEven }>{ formatNumber(row.profit) }</ReportTableTd>
						</tr>
					);
				}) }
				</tbody>
			</table>
		);
	}

	return <TablePreview.Empty/>;
}