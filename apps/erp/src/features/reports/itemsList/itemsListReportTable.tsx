import { useSignals } from "@preact/signals-react/runtime";
import { Cubits } from "@/core/services/cubits.ts";
import { ReportTableTh } from "@/features/report/components/reportTableTh.tsx";
import { ReportTableTd } from "@/features/report/components/reportTableTd.tsx";
import { formatNumber } from "@/features/report/utils/formating.ts";
import { PageError, PageLoaded, PageLoading, TablePreview } from "yusr-ui";


export function ItemsListReportTable()
{
	useSignals();

	if (Cubits.items.state.value instanceof PageLoading)
	{
		return <TablePreview.Loading/>;
	}

	if (Cubits.items.state.value instanceof PageError)
	{
		return <TablePreview.Error/>;
	}
	if (Cubits.items.state.value instanceof PageLoaded)
	{
		return (
			<table className="w-full mt-5 border-collapse rounded-lg overflow-hidden">
				<thead>
				<tr>
					<ReportTableTh ar="الرقم" en="No."/>
					<ReportTableTh ar="رقم المادة" en="Item Id"/>
					<ReportTableTh ar="نوع المادة" en="Item type"/>
					<ReportTableTh ar="اسم المادة" en="Item Name"/>
					<ReportTableTh ar="الصنف" en="category"/>
					<ReportTableTh ar="العلامة التجارية" en="brand"/>
					<ReportTableTh ar="الوحدة الأساسية" en="main unit"/>
					<ReportTableTh ar="الكمية" en="quantity"/>
					<ReportTableTh ar="التكلفة" en="cost"/>
					<ReportTableTh ar="التكلفة الإجمالية" en="total cost"/>
				</tr>
				</thead>
				<tbody>
				{ Cubits.items.entities.value.map((item, idx) =>
				{
					const isEven = idx % 2 === 0;
					return (
						<tr key={ item.id }>
							<ReportTableTd
								isEven={ isEven }>{ idx + 1 + ((Cubits.items.currentPage.value - 1) * Cubits.items.pageSize.value) }</ReportTableTd>
							<ReportTableTd isEven={ isEven }>{ item.id }</ReportTableTd>
							<ReportTableTd isEven={ isEven } align="start">{ item.type }</ReportTableTd>
							<ReportTableTd isEven={ isEven } align="start">{ item.name }</ReportTableTd>
							<ReportTableTd isEven={ isEven } align="start">{ item.class }</ReportTableTd>
							<ReportTableTd isEven={ isEven } align="start">{ item.brand }</ReportTableTd>
							<ReportTableTd isEven={ isEven } align="start">{ item.sellUnitName }</ReportTableTd>
							<ReportTableTd isEven={ isEven }>{ formatNumber(item.quantity) }</ReportTableTd>
							<ReportTableTd isEven={ isEven }>{ formatNumber(item.cost) }</ReportTableTd>
							<ReportTableTd
								isEven={ isEven }>{ formatNumber(item.quantity * item.cost) }</ReportTableTd>
						</tr>
					);
				}) }
				</tbody>
			</table>
		);
	}

	return <TablePreview.Empty/>;
}