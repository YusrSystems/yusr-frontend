export interface InvoiceLineItem
{
	id: number;
	itemName: string;
	description?: string;
	quantity: number;
	unitPrice: number;
	settlementAmount: number;
	taxAmount: number;
	taxPercent: number;
	totalAfterTax: number;
}

interface ReportInvoiceTableProps
{
	items: InvoiceLineItem[];
}

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

export function ReportInvoiceTable({items}: ReportInvoiceTableProps)
{
	return (
		<table className="w-full border-collapse rounded-[5px] overflow-hidden">
			<thead>
			<tr>
				<Th ar="الرقم" en="No."/>
				<Th ar="اسم المادة" en="Item Name" align="start"/>
				<Th ar="الوصف" en="Description" align="start"/>
				<Th ar="الكمية" en="Quantity"/>
				<Th ar="سعر الوحدة" en="Unit price"/>
				<Th ar="التسوية" en="Settlement"/>
				<Th ar="قيمة الضريبة" en="Tax Amount"/>
				<Th ar="الإجمالي بعد الضريبة" en="Total After Tax"/>
			</tr>
			</thead>
			<tbody>
			{ items.map((item, idx) =>
			{
				const isEven = idx % 2 === 0;
				return (
					<tr key={ item.id }>
						<Td isEven={ isEven }>{ item.id }</Td>
						<Td isEven={ isEven } align="start">{ item.itemName }</Td>
						<Td isEven={ isEven } align="start">{ item.description ?? "" }</Td>
						<Td isEven={ isEven }>{ numberFmt(item.quantity) }</Td>
						<Td isEven={ isEven }><span className="font-semibold">{ numberFmt(item.unitPrice) }</span></Td>
						<Td isEven={ isEven }><span
							className="font-semibold">{ numberFmt(item.settlementAmount) }</span></Td>
						<Td isEven={ isEven }>
							<span className="font-semibold">
								{ numberFmt(item.taxAmount) } ({ item.taxPercent }%)
							</span>
						</Td>
						<Td isEven={ isEven }><span
							className="font-semibold">{ numberFmt(item.totalAfterTax) }</span></Td>
					</tr>
				);
			}) }
			</tbody>
		</table>
	);
}