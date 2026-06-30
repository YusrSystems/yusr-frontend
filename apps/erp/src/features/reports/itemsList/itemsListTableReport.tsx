import { useSignals } from "@preact/signals-react/runtime";
import { Cubits } from "@/core/services/cubits.ts";


const numberFmt = (n: number) => n.toLocaleString("en-US", {minimumFractionDigits: 2, maximumFractionDigits: 2});

function Th({ar, en, align = "center"}: { ar: string; en: string; align?: "center" | "start" })
{
	return (
		<th
			className={ `border border-border bg-muted p-1.5 text-[7pt] font-bold text-foreground leading-tight ${
				align === "start" ? "text-start" : "text-center"
			}` }
		>
			<div>{ ar }</div>
			<div className="font-normal" dir="ltr">{ en }</div>
		</th>
	);
}

function Td({children, isEven, align = "center"}: {
	children: React.ReactNode;
	isEven: boolean;
	align?: "center" | "start"
})
{
	return (
		<td
			className={ `border border-border p-1.5 text-[8pt] text-foreground print:break-inside-avoid ${
				isEven ? "bg-muted/50" : "bg-background"
			} ${ align === "start" ? "text-start" : "text-center" }` }
		>
			{ children }
		</td>
	);
}

export function ItemsListTableReport()
{
	useSignals();
	return (
		<table className="w-full border-collapse rounded-[5px] overflow-hidden">
			<thead>
			<tr>
				<Th ar="الرقم" en="No."/>
				<Th ar="رقم المادة" en="Item Id" align="start"/>
				<Th ar="نوع المادة" en="Item type" align="start"/>
				<Th ar="اسم المادة" en="Item Name" align="start"/>
				<Th ar="الصنف" en="category" align="start"/>
				<Th ar="العلامة التجارية" en="brand" align="start"/>
				<Th ar="الوحدة الأساسية" en="main unit" align="start"/>
				<Th ar="الكمية" en="quantity" align="start"/>
				<Th ar="التكلفة" en="cost" align="start"/>
				<Th ar="التكلفة الإجمالية" en="total cost" align="start"/>
			</tr>
			</thead>
			<tbody>
			{ Cubits.items.entities.value.map((item, idx) =>
			{
				const isEven = idx % 2 === 0;
				return (
					<tr key={ item.id.value }>
						<Td isEven={ isEven }>{ idx + 1 }</Td>
						<Td isEven={ isEven }>{ item.id.value }</Td>
						<Td isEven={ isEven } align="start">{ item.type }</Td>
						<Td isEven={ isEven } align="start">{ item.name }</Td>
						<Td isEven={ isEven } align="start">{ item.class }</Td>
						<Td isEven={ isEven } align="start">{ item.brand }</Td>
						<Td isEven={ isEven } align="start">{ item.sellUnitName }</Td>
						<Td isEven={ isEven }>{ numberFmt(item.quantity.value) }</Td>
						<Td isEven={ isEven }>{ numberFmt(item.cost.value) }</Td>
						<Td isEven={ isEven }>{ numberFmt(item.quantity.value * item.cost.value) }</Td>
					</tr>
				);
			}) }
			</tbody>
		</table>
	);
}