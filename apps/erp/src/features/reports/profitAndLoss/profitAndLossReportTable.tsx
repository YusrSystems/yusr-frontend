import { ReportTableTh } from "@/features/report/components/reportTableTh.tsx";
import { ReportTableTd } from "@/features/report/components/reportTableTd.tsx";
import { formatNumber } from "@/features/report/utils/formating.ts";
import {
	AccountOrStoreType,
	type ProfitAndLossRow
} from "@/features/reports/profitAndLoss/profitAndLossReportResult.ts";
import { AccountType } from "@/core/data/account.ts";
import { Cubits } from "@/core/services/cubits.ts";
import { useSignals } from "@preact/signals-react/runtime";
import { ReportLoaded, ReportLoading, TablePreview } from "yusr-ui";
import { Link } from "react-router-dom";
import { InvoiceType } from "@/core/types/invoiceType.ts";
import { useTranslation } from "react-i18next";


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

function PartyCell({isEven, name, id, type, accountType}: {
	isEven: boolean;
	name?: string;
	id?: number;
	type: AccountOrStoreType;
	accountType?: AccountType;
})
{
	const route = id != null ? partyRoute(type, accountType) : undefined;

	if (!route || id == null)
	{
		return <ReportTableTd isEven={ isEven } align="start">{ name ?? "" }</ReportTableTd>;
	}

	return (
		<ReportTableTd isEven={ isEven } className={ linkClassName } align="start">
			<Link
				to={ `/${ route }/${ id }` }
				target="_blank"
				rel="noopener noreferrer"
				className="block w-full h-full"
			>
				{ name }
			</Link>
		</ReportTableTd>
	);
}

export function ProfitAndLossReportTable()
{
	useSignals();

	const {t} = useTranslation("accounting");

	if (Cubits.ProfitAndLossReport.state.value instanceof ReportLoading)
	{
		return <TablePreview.Loading/>;
	}

	if (Cubits.ProfitAndLossReport.state.value instanceof ReportLoaded)
	{
		const rows: ProfitAndLossRow[] = Cubits.ProfitAndLossReport.result.value?.invoiceListRows ?? [];

		return (
			<table className="w-full mt-5 border-collapse rounded-lg overflow-hidden">
				<thead>
				<tr>
					<ReportTableTh ar="الرقم" en="No."/>
					<ReportTableTh ar="التاريخ" en="Date"/>
					<ReportTableTh ar="رقم الفاتورة" en="Invoice id"/>
					<ReportTableTh ar="نوع الفاتورة" en="Invoice type"/>
					<ReportTableTh ar="من" en="From"/>
					<ReportTableTh ar="إلى" en="To"/>
					<ReportTableTh ar="الكمية" en="Quantity"/>
					<ReportTableTh ar="التكلفة" en="Cost"/>
					<ReportTableTh ar="المبلغ" en="Amount"/>
					<ReportTableTh ar="قيمة الضريبة" en="Tax amount"/>
					<ReportTableTh ar="الربح" en="Profit"/>
				</tr>
				</thead>
				<tbody>
				{ rows.map((row, idx) =>
				{
					const isEven = idx % 2 === 0;
					const isSell = row.invoiceType === InvoiceType.Sell;
					return (
						<tr key={ row.id }>
							<ReportTableTd isEven={ isEven }>{ row.id }</ReportTableTd>
							<ReportTableTd isEven={ isEven }
							               className="max-w-20! min-w-20!">{ row.invoiceDate }</ReportTableTd>
							<ReportTableTd isEven={ isEven } className={ linkClassName }>
								<Link
									to={ `/sales/${ row.invoiceId }` }
									target="_blank"
									rel="noopener noreferrer"
									className="block w-full h-full"
								>
									{ row.invoiceId }
								</Link>
							</ReportTableTd>
							<ReportTableTd
								isEven={ isEven }
								align="start"
								className={ isSell
									? "text-emerald-600! font-bold!"
									: "text-destructive! font-bold!" }
							>
								{ isSell ? t("invoices.sellInvoice") : t("invoices.sellReturn") }
							</ReportTableTd>
							<PartyCell
								isEven={ isEven }
								name={ row.fromName }
								id={ row.fromId }
								type={ row.fromType }
								accountType={ row.fromAccountType }
							/>
							<PartyCell
								isEven={ isEven }
								name={ row.toName }
								id={ row.toId }
								type={ row.toType }
								accountType={ row.toAccountType }
							/>
							<ReportTableTd isEven={ isEven }>{ formatNumber(row.quantity) }</ReportTableTd>
							<ReportTableTd isEven={ isEven }>{ formatNumber(row.cost) }</ReportTableTd>
							<ReportTableTd isEven={ isEven }>{ formatNumber(row.amount) }</ReportTableTd>
							<ReportTableTd isEven={ isEven }>{ formatNumber(row.taxAmount) }</ReportTableTd>
							<ReportTableTd
								isEven={ isEven }
								className={ row.profit >= 0
									? "text-emerald-600! font-bold!"
									: "text-destructive! font-bold!" }
							>
								{ formatNumber(row.profit) }
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