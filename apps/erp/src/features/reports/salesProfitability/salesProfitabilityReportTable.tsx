import { ReportTableTh } from "@/features/report/components/reportTableTh";
import { ReportTableTd } from "@/features/report/components/reportTableTd";
import { formatNumber } from "@/features/report/utils/formating";
import { Cubits } from "@/core/services/cubits";
import { useSignals } from "@preact/signals-react/runtime";
import { ReportLoaded, ReportLoading, TablePreview } from "yusr-ui";
import { Link } from "react-router-dom";
import { ProfitAndLossRowDocumentType } from "./salesProfitabilityReportResult";
import { useTranslation } from "react-i18next";


const linkClassName = "p-0! text-blue-600! hover:bg-blue-100/50! hover:underline! print:text-foreground! print:no-underline! print:bg-transparent!";

export function getProfitAndLossRowDocumentTypeName(type: ProfitAndLossRowDocumentType, t: any): string
{
	switch (type)
	{
		case ProfitAndLossRowDocumentType.Sell:
			return t("accounting:invoices.sellInvoice");
		case ProfitAndLossRowDocumentType.SellReturn:
			return t("accounting:invoices.sellReturn");
		case ProfitAndLossRowDocumentType.Payment:
			return t("accounting:vouchers.paymentVoucher");
		default:
			return "Unknown";
	}
}

export function getProfitAndLossRowDocumentRoute(type: ProfitAndLossRowDocumentType): string | undefined
{
	switch (type)
	{
		case ProfitAndLossRowDocumentType.Sell:
		case ProfitAndLossRowDocumentType.SellReturn:
			return "sales";
		case ProfitAndLossRowDocumentType.Payment:
			return "vouchers";
		default:
			return undefined;
	}
}

export function SalesProfitabilityReportTable()
{
	useSignals();
	const {t} = useTranslation(["accounting"]);

	if (Cubits.SalesProfitabilityReport.state.value instanceof ReportLoading)
	{
		return <TablePreview.Loading/>;
	}

	if (Cubits.SalesProfitabilityReport.state.value instanceof ReportLoaded)
	{
		const lines = Cubits.SalesProfitabilityReport.result.value?.lines ?? [];

		return (
			<table className="w-full mt-5 border-collapse rounded-lg overflow-hidden">
				<thead>
				<tr>
					<ReportTableTh ar="التاريخ" en="Date"/>
					<ReportTableTh ar="نوع المستند" en="Doc Type"/>
					<ReportTableTh ar="رقم المستند" en="Doc No."/>
					<ReportTableTh ar="الجهة" en="Partner" align="start"/>
					<ReportTableTh ar="الحساب" en="Account" align="start"/>
					<ReportTableTh ar="البيان" en="Description" align="start"/>
					<ReportTableTh ar="المبيعات" en="Sales"/>
					<ReportTableTh ar="التكلفة" en="COGS"/>
					<ReportTableTh ar="تكاليف مباشرة" en="Direct Costs"/>
					<ReportTableTh ar="صافي الربح" en="Net Profit"/>
				</tr>
				</thead>
				<tbody>
				{ lines.map((row, idx) =>
				{
					const isEven = idx % 2 === 0;
					const routePath = getProfitAndLossRowDocumentRoute(row.documentType);

					return (
						<tr key={ `${ row.id }-${ idx }` }>
							<ReportTableTd className="min-w-20" isEven={ isEven }>{ row.date }</ReportTableTd>
							<ReportTableTd
								isEven={ isEven }>{ getProfitAndLossRowDocumentTypeName(row.documentType, t) }</ReportTableTd>

							{ routePath ? (
								<ReportTableTd isEven={ isEven } className={ linkClassName }>
									<Link
										to={ `/${ routePath }/${ row.documentId }` }
										target="_blank"
										rel="noopener noreferrer"
										className="block w-full h-full"
									>
										{ row.documentId }
									</Link>
								</ReportTableTd>
							) : (
								<ReportTableTd isEven={ isEven }>{ row.documentId || "-" }</ReportTableTd>
							) }

							<ReportTableTd isEven={ isEven } align="start">{ row.partnerName || "-" }</ReportTableTd>
							<ReportTableTd isEven={ isEven } align="start">{ row.glAccountName || "-" }</ReportTableTd>
							<ReportTableTd isEven={ isEven } align="start">{ row.description || "-" }</ReportTableTd>

							<ReportTableTd isEven={ isEven } className="text-blue-600! font-semibold!">
								{ formatNumber(row.salesAmount) }
							</ReportTableTd>
							<ReportTableTd isEven={ isEven } className="text-orange-600! font-semibold!">
								{ formatNumber(row.cogsAmount) }
							</ReportTableTd>
							<ReportTableTd isEven={ isEven } className="text-red-600! font-semibold!">
								{ formatNumber(row.directCostsAmount) }
							</ReportTableTd>
							<ReportTableTd isEven={ isEven }
							               className={ row.netProfit >= 0 ? "text-emerald-600! font-bold!" : "text-destructive! font-bold!" }>
								{ formatNumber(row.netProfit) }
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