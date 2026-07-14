import { ReportTableTh } from "@/features/report/components/reportTableTh.tsx";
import { ReportTableTd } from "@/features/report/components/reportTableTd.tsx";
import { formatNumber } from "@/features/report/utils/formating.ts";
import {
	AccountOrStoreType,
	ItemStatementDocumentType,
	type ItemStatementRow
} from "@/features/reports/itemStatement/itemStatementReportResult.ts";
import { AccountType } from "@/core/data/account.ts";
import { Cubits } from "@/core/services/cubits.ts";
import { useSignals } from "@preact/signals-react/runtime";
import { ReportLoaded, ReportLoading, TablePreview } from "yusr-ui";
import { Link } from "react-router-dom";
import { InvoiceType } from "@/core/types/invoiceType.ts";


function invoiceRoute(invoiceType?: InvoiceType): string
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

function transRoute(row: ItemStatementRow): string | undefined
{
	switch (row.documentType)
	{
		case ItemStatementDocumentType.Invoice:
			return invoiceRoute(row.invoiceType);
		case ItemStatementDocumentType.Transfer:
			return "itemTransfers";
		case ItemStatementDocumentType.Settlement:
			return "itemsSettlements";
		default:
			return undefined;
	}
}

function partyRoute(type: AccountOrStoreType, accountType?: AccountType): string | undefined
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
			return undefined;
	}
}

const linkClassName = "text-blue-600! hover:bg-blue-100/50! hover:underline! print:text-foreground! print:no-underline! print:bg-transparent!";

function LinkOrText({isEven, route, id, text, align}: {
	isEven: boolean;
	route?: string;
	id?: number;
	text?: string;
	align?: "center" | "start";
})
{
	if (!route || id == null)
	{
		return <ReportTableTd isEven={ isEven } align={ align }>{ text ?? "" }</ReportTableTd>;
	}

	return (
		<ReportTableTd isEven={ isEven } className={ linkClassName } align={ align }>
			<Link
				to={ `/${ route }/${ id }` }
				target="_blank"
				rel="noopener noreferrer"
				className="block w-full h-full"
			>
				{ text }
			</Link>
		</ReportTableTd>
	);
}

export function ItemStatementReportTable()
{
	useSignals();

	if (Cubits.ItemStatementReport.state.value instanceof ReportLoading)
	{
		return <TablePreview.Loading/>;
	}

	if (Cubits.ItemStatementReport.state.value instanceof ReportLoaded)
	{
		const rows = Cubits.ItemStatementReport.result.value?.itemStatementRows ?? [];

		return (
			<table className="w-full mt-5 border-collapse rounded-lg overflow-hidden">
				<thead>
				<tr>
					<ReportTableTh ar="التاريخ" en="Date"/>
					<ReportTableTh ar="نوع العملية" en="Trans type"/>
					<ReportTableTh ar="رقم العملية" en="Trans id"/>
					<ReportTableTh ar="التكلفة" en="Cost"/>
					<ReportTableTh ar="الكمية في العملية" en="Qtn in trans"/>
					<ReportTableTh ar="الكمية في الوحدة الأساسية" en="Qtn in main unit"/>
					<ReportTableTh ar="كمية المادة" en="Item qtn"/>
					<ReportTableTh ar="المستودع" en="Store"/>
					<ReportTableTh ar="الحساب / المستودع" en="Account / Store"/>
				</tr>
				</thead>
				<tbody>
				{ rows.map((row, idx) =>
				{
					const isEven = idx % 2 === 0;
					const transRouteName = transRoute(row);
					const partyRouteName = partyRoute(row.secondPartyType, row.secondPartyAccountType);

					return (
						<tr key={ `${ row.transDate }-${ row.transId }-${ idx }` }>
							<ReportTableTd isEven={ isEven }>{ row.transDate }</ReportTableTd>
							<ReportTableTd isEven={ isEven }>{ row.transType }</ReportTableTd>
							<LinkOrText
								isEven={ isEven }
								route={ transRouteName }
								id={ row.transId || undefined }
								text={ row.transId.toString() }
							/>
							<ReportTableTd isEven={ isEven }>{ formatNumber(row.cost) }</ReportTableTd>
							<ReportTableTd isEven={ isEven }>{ formatNumber(row.transQtn) }</ReportTableTd>
							<ReportTableTd isEven={ isEven }>{ formatNumber(row.mainUnitQtn) }</ReportTableTd>
							<ReportTableTd isEven={ isEven }>{ formatNumber(row.itemQtn) }</ReportTableTd>
							<LinkOrText
								isEven={ isEven }
								route="stores"
								id={ row.storeId }
								text={ row.storeName }
								align="start"
							/>
							<LinkOrText
								isEven={ isEven }
								route={ partyRouteName }
								id={ row.secondPartyId }
								text={ row.secondPartyName }
								align="start"
							/>
						</tr>
					);
				}) }
				</tbody>
			</table>
		);
	}

	return <TablePreview.Empty/>;
}