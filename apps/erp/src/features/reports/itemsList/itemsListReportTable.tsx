import { useSignals } from "@preact/signals-react/runtime";
import { Cubits } from "@/core/services/cubits.ts";
import { ReportTableTh } from "@/features/report/components/reportTableTh.tsx";
import { ReportTableTd } from "@/features/report/components/reportTableTd.tsx";
import { numberFmt } from "@/features/report/utils/formating.ts";


export function ItemsListReportTable()
{
	useSignals();
	return (
		<table className="w-full border-collapse rounded-[5px] overflow-hidden">
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
			{ Cubits.items.reportEntities.value.map((item, idx) =>
			{
				const isEven = idx % 2 === 0;
				return (
					<tr key={ item.id.value }>
						<ReportTableTd isEven={ isEven }>{ idx + 1 }</ReportTableTd>
						<ReportTableTd isEven={ isEven }>{ item.id.value }</ReportTableTd>
						<ReportTableTd isEven={ isEven } align="start">{ item.type }</ReportTableTd>
						<ReportTableTd isEven={ isEven } align="start">{ item.name }</ReportTableTd>
						<ReportTableTd isEven={ isEven } align="start">{ item.class }</ReportTableTd>
						<ReportTableTd isEven={ isEven } align="start">{ item.brand }</ReportTableTd>
						<ReportTableTd isEven={ isEven } align="start">{ item.sellUnitName }</ReportTableTd>
						<ReportTableTd isEven={ isEven }>{ numberFmt(item.quantity.value) }</ReportTableTd>
						<ReportTableTd isEven={ isEven }>{ numberFmt(item.cost.value) }</ReportTableTd>
						<ReportTableTd
							isEven={ isEven }>{ numberFmt(item.quantity.value * item.cost.value) }</ReportTableTd>
					</tr>
				);
			}) }
			</tbody>
		</table>
	);
}