import { ReportTableTh } from "@/features/report/components/reportTableTh.tsx";
import { ReportTableTd } from "@/features/report/components/reportTableTd.tsx";
import { formatNumber } from "@/features/report/utils/formating.ts";
import { type ItemTaxStatementRow } from "@/features/reports/itemsTaxStatement/itemsTaxStatementReportResult.ts";
import { Cubits } from "@/core/services/cubits.ts";
import { useSignals } from "@preact/signals-react/runtime";
import { ReportLoaded, ReportLoading, TablePreview } from "yusr-ui";
import { Link } from "react-router-dom";
import { InvoiceType } from "@/core/types/invoiceType.ts";
import { AccountType } from "@/core/data/account.ts";
import { AccountOrStoreType } from "@/features/reports/itemStatement/itemStatementReportResult.ts";


function invoiceRoute(invoiceType: InvoiceType): string
{
	switch (invoiceType)
	{
		case InvoiceType.Sell:
		case InvoiceType.SellReturn:
			return "sales";
		case InvoiceType.Purchase:
		case InvoiceType.PurchaseReturn:
			return "purchases";
		default:
			return "sales";
	}
}

function partyRoute(type: AccountOrStoreType, accountType?: AccountType): string
{
	if (type === AccountOrStoreType.Store)
	{
		return "stores";
	}

	switch (accountType)
	{
		case AccountType.Client:
			return "clients";
		case AccountType.Supplier:
			return "suppliers";
		case AccountType.Employee:
			return "employees";
		case AccountType.Bank:
			return "banks";
		case AccountType.Box:
			return "boxes";
		default:
			return "clients";
	}
}

const linkClassName = "p-0! text-blue-600! hover:bg-blue-100/50! hover:underline! print:text-foreground! print:no-underline! print:bg-transparent!";

function RowLinks({row, isEven}: { row: ItemTaxStatementRow; isEven: boolean })
{
	return (
		<>
			<ReportTableTd isEven={ isEven }>{ row.date }</ReportTableTd>
			<ReportTableTd isEven={ isEven } className={ linkClassName }>
				<Link
					to={ `/${ invoiceRoute(row.invoiceType) }/${ row.invoiceId }` }
					target="_blank"
					rel="noopener noreferrer"
					className="block w-full h-full"
				>
					{ row.invoiceId }
				</Link>
			</ReportTableTd>
			<ReportTableTd isEven={ isEven } className={ linkClassName }>
				<Link
					to={ `/items/${ row.itemId }` }
					target="_blank"
					rel="noopener noreferrer"
					className="block w-full h-full"
				>
					{ row.itemName }
				</Link>
			</ReportTableTd>
			<ReportTableTd isEven={ isEven } className={ linkClassName }>
				<Link
					to={ `/${ partyRoute(row.fromType) }/${ row.fromId }` }
					target="_blank"
					rel="noopener noreferrer"
					className="block w-full h-full"
				>
					{ row.from }
				</Link>
			</ReportTableTd>
			<ReportTableTd isEven={ isEven } className={ linkClassName }>
				<Link
					to={ `/${ partyRoute(row.toType) }/${ row.toId }` }
					target="_blank"
					rel="noopener noreferrer"
					className="block w-full h-full"
				>
					{ row.to }
				</Link>
			</ReportTableTd>
		</>
	);
}

export function ItemsTaxStatementReportTable()
{
	useSignals();

	if (Cubits.ItemsTaxStatementReport.state.value instanceof ReportLoading)
	{
		return <TablePreview.Loading/>;
	}

	if (Cubits.ItemsTaxStatementReport.state.value instanceof ReportLoaded)
	{
		const rows = Cubits.ItemsTaxStatementReport.result.value?.itemTaxStatementRows ?? [];

		return (
			<table className="w-full mt-5 border-collapse rounded-lg overflow-hidden">
				<thead>
				<tr>
					<ReportTableTh ar="الرقم" en="No."/>
					<ReportTableTh ar="التاريخ" en="Date"/>
					<ReportTableTh ar="رقم الفاتورة" en="Invoice"/>
					<ReportTableTh ar="اسم المادة" en="Item"/>
					<ReportTableTh ar="من" en="From"/>
					<ReportTableTh ar="إلى" en="To"/>
					<ReportTableTh ar="الكمية" en="Quantity"/>
					<ReportTableTh ar="المبلغ" en="Amount"/>
					<ReportTableTh ar="قيمة الضريبة" en="Tax amount"/>
				</tr>
				</thead>
				<tbody>
				{ rows.map((row, idx) =>
				{
					const isEven = idx % 2 === 0;
					return (
						<tr key={ row.id }>
							<ReportTableTd isEven={ isEven }>{ row.id }</ReportTableTd>
							<RowLinks row={ row } isEven={ isEven }/>
							<ReportTableTd isEven={ isEven }>{ formatNumber(row.quantity) }</ReportTableTd>
							<ReportTableTd isEven={ isEven }>{ formatNumber(row.amount) }</ReportTableTd>
							<ReportTableTd isEven={ isEven }>{ formatNumber(row.tax) }</ReportTableTd>
						</tr>
					);
				}) }
				</tbody>
			</table>
		);
	}

	return <TablePreview.Empty/>;
}