import { useSignals } from "@preact/signals-react/runtime";
import { Cubits } from "@/core/services/cubits.ts";
import { ReportTableTh } from "@/features/report/components/reportTableTh.tsx";
import { ReportTableTd } from "@/features/report/components/reportTableTd.tsx";
import { formatNumber } from "@/features/report/utils/formating.ts";
import { PageError, PageLoaded, PageLoading, TablePreview } from "yusr-ui";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { InvoiceType } from "@/core/types/invoiceType.ts";
import { AccountType } from "@/core/data/account.ts";


export function InvoicesListReportTable()
{
	useSignals();
	const {t} = useTranslation("accounting");

	if (Cubits.invoices.state.value instanceof PageLoading)
	{
		return <TablePreview.Loading/>;
	}

	if (Cubits.invoices.state.value instanceof PageError)
	{
		return <TablePreview.Error/>;
	}

	function accountRoute(accountType?: AccountType): string
	{
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

	if (Cubits.invoices.state.value instanceof PageLoaded)
	{
		return (
			<table className="w-full mt-5 border-collapse rounded-lg overflow-hidden">
				<thead>
				<tr>
					<ReportTableTh ar="الرقم" en="No."/>
					<ReportTableTh ar="رقم الفاتورة" en="Inv id"/>
					<ReportTableTh ar="نوع الفاتورة" en="Inv type"/>
					<ReportTableTh ar="تاريخ الفاتورة" en="Inv date"/>
					<ReportTableTh ar="من" en="From"/>
					<ReportTableTh ar="إلى" en="To"/>
					<ReportTableTh ar="المبلغ" en="Amount"/>
					<ReportTableTh ar="المبلغ المدفوع" en="Paid amount"/>
				</tr>
				</thead>
				<tbody>
				{ Cubits.invoices.entities.value.map((invoice, idx) =>
				{
					const isEven = idx % 2 === 0;

					let invoiceTypeLabel;
					switch (invoice.type)
					{
						case InvoiceType.Sell:
							invoiceTypeLabel = t("invoices.sellInvoice");
							break;
						case InvoiceType.Purchase:
							invoiceTypeLabel = t("invoices.purchaseInvoice");
							break;
						case InvoiceType.SellReturn:
							invoiceTypeLabel = t("invoices.sellReturn");
							break;
						case InvoiceType.PurchaseReturn:
							invoiceTypeLabel = t("invoices.purchaseReturn");
							break;
						case InvoiceType.Quotation:
							invoiceTypeLabel = t("invoices.quotation");
							break;
						default:
							invoiceTypeLabel = String(invoice.type);
					}

					return (
						<tr key={ invoice.id }>
							<ReportTableTd isEven={ isEven }>
								{ idx + 1 + ((Cubits.invoices.currentPage.value - 1) * Cubits.invoices.pageSize.value) }
							</ReportTableTd>

							<ReportTableTd
								isEven={ isEven }
								className="p-0! text-blue-600! hover:bg-blue-100/50! hover:underline! print:text-foreground! print:no-underline! print:bg-transparent!"
							>
								<Link
									to={ `/invoices/${ invoice.id }` }
									target="_blank"
									rel="noopener noreferrer"
									className="block w-full h-full"
								>
									{ invoice.id }
								</Link>
							</ReportTableTd>

							<ReportTableTd isEven={ isEven } align="start">{ invoiceTypeLabel }</ReportTableTd>
							<ReportTableTd isEven={ isEven }>{ String(invoice.date).split("T")[0] }</ReportTableTd>
							<ReportTableTd
								isEven={ isEven }
								align="start"
								className="text-blue-600! hover:bg-blue-100/50! hover:underline! print:text-foreground! print:no-underline! print:bg-transparent!"
							>
								<Link
									to={ `/stores/${ invoice.storeId }` }
									target="_blank"
									rel="noopener noreferrer"
									className="block w-full h-full"
								>
									{ invoice.storeName }
								</Link>
							</ReportTableTd>
							<ReportTableTd
								isEven={ isEven }
								align="start"
								className="text-blue-600! hover:bg-blue-100/50! hover:underline! print:text-foreground! print:no-underline! print:bg-transparent!"
							>
								<Link
									to={ `/${ accountRoute(invoice.actionAccountType) }/${ invoice.actionAccountId }` }
									target="_blank"
									rel="noopener noreferrer"
									className="block w-full h-full"
								>
									{ invoice.actionAccountName }
								</Link>
							</ReportTableTd>
							<ReportTableTd isEven={ isEven }>{ formatNumber(invoice.fullAmount) }</ReportTableTd>
							<ReportTableTd
								isEven={ isEven }
								className={
									invoice.fullAmount === invoice.paidAmount
										? "text-green-600!"
										: invoice.type === InvoiceType.Quotation
											? "text-black"
											: "text-red-600!"
								}
							>
								{ invoice.type === InvoiceType.Quotation ? "-" :
									formatNumber(invoice.paidAmount) }
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