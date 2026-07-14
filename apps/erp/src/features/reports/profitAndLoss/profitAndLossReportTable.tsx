import { ReportTableTh } from "@/features/report/components/reportTableTh.tsx";
import { ReportTableTd } from "@/features/report/components/reportTableTd.tsx";
import { formatNumber } from "@/features/report/utils/formating.ts";
import {
	type ProfitAndLossRow,
	ProfitAndLossRowDocumentType
} from "@/features/reports/profitAndLoss/profitAndLossReportResult.ts";
import { Cubits } from "@/core/services/cubits.ts";
import { useSignals } from "@preact/signals-react/runtime";
import { ReportLoaded, ReportLoading, TablePreview } from "yusr-ui";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";


const linkClassName = "text-blue-600! hover:bg-blue-100/50! hover:underline! print:text-foreground! print:no-underline! print:bg-transparent!";

function getDocumentTypeMeta(type: ProfitAndLossRowDocumentType, t: TFunction<"accounting">)
{
	switch (type)
	{
		case ProfitAndLossRowDocumentType.Sell:
			return {label: t("invoices.sellInvoice"), className: "text-emerald-600! font-bold!"};
		case ProfitAndLossRowDocumentType.SellReturn:
			return {label: t("invoices.sellReturn"), className: "text-destructive! font-bold!"};
		case ProfitAndLossRowDocumentType.Payment:
			return {label: t("vouchers.paymentVoucher"), className: "text-amber-600! font-bold!"};
		default:
			return {label: t("invoices.unknown"), className: ""};
	}
}

function getDocumentRoute(type: ProfitAndLossRowDocumentType, id: number): string
{
	const isInvoice = type === ProfitAndLossRowDocumentType.Sell || type === ProfitAndLossRowDocumentType.SellReturn;
	return isInvoice ? `/sales/${ id }` : `/vouchers/${ id }`;
}

export function ProfitAndLossReportTable()
{
	useSignals();
	const {t} = useTranslation(["accounting", "common"]);

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
					<ReportTableTh ar="رقم المستند" en="Doc No."/>
					<ReportTableTh ar="نوع المستند" en="Doc Type"/>
					<ReportTableTh ar="من" en="From"/>
					<ReportTableTh ar="إلى" en="To"/>
					<ReportTableTh ar="البيان" en="Description"/>
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
					const {label: typeLabel, className: typeClassName} = getDocumentTypeMeta(row.documentType, t);
					const routePath = getDocumentRoute(row.documentType, row.documentId);

					return (
						<tr key={ row.id }>
							<ReportTableTd isEven={ isEven }>{ row.id }</ReportTableTd>
							<ReportTableTd isEven={ isEven }
							               className="max-w-20! min-w-20!">{ row.date }</ReportTableTd>
							<ReportTableTd isEven={ isEven } className={ linkClassName }>
								<Link
									to={ routePath }
									target="_blank"
									rel="noopener noreferrer"
									className="block w-full h-full"
								>
									{ row.documentId }
								</Link>
							</ReportTableTd>
							<ReportTableTd isEven={ isEven } align="start"
							               className={ `${ typeClassName } max-w-20! min-w-20!` }>
								{ typeLabel }
							</ReportTableTd>
							<ReportTableTd isEven={ isEven } align="start">{ row.fromName ?? "-" }</ReportTableTd>
							<ReportTableTd isEven={ isEven } align="start">{ row.toName ?? "-" }</ReportTableTd>
							<ReportTableTd isEven={ isEven } align="start"
							               className="max-w-40 truncate">{ row.description ?? "-" }</ReportTableTd>
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