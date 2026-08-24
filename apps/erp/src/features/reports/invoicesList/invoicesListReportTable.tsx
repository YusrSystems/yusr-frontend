import { useSignals } from "@preact/signals-react/runtime";
import { ReportTableTh } from "@/features/report/components/reportTableTh";
import { ReportTableTd } from "@/features/report/components/reportTableTd";
import { formatNumber } from "@/features/report/utils/formating";
import { PageCubit, PageError, PageLoaded, PageLoading, TablePreview } from "yusr-ui";
import { Link } from "react-router-dom";
import type { ICommercialInvoiceDocumentDto } from "@/core/data/commercial/commercialInvoiceDocument";


export interface InvoicesListReportTableProps<
	TInvoiceDto extends ICommercialInvoiceDocumentDto & { type: number }
>
{
	cubit: PageCubit<TInvoiceDto>;
	getTypeName: (type: TInvoiceDto["type"]) => string;
	routePrefix?: string;
}

export function InvoicesListReportTable<
	TInvoiceDto extends ICommercialInvoiceDocumentDto & { type: number }
>({
	cubit,
	getTypeName,
	routePrefix = "sales"
}: InvoicesListReportTableProps<TInvoiceDto>)
{
	useSignals();

	if (cubit.state.value instanceof PageLoading)
	{
		return <TablePreview.Loading/>;
	}

	if (cubit.state.value instanceof PageError)
	{
		return <TablePreview.Error/>;
	}

	if (cubit.state.value instanceof PageLoaded)
	{
		const items = cubit.entities.value;

		return (
			<table className="w-full mt-5 border-collapse rounded-lg overflow-hidden">
				<thead>
				<tr>
					<ReportTableTh ar="الرقم" en="No."/>
					<ReportTableTh ar="رقم الفاتورة" en="Inv id"/>
					<ReportTableTh ar="نوع الفاتورة" en="Inv type"/>
					<ReportTableTh ar="تاريخ الفاتورة" en="Inv date"/>
					<ReportTableTh ar="المستودع" en="Store"/>
					<ReportTableTh ar="الجهة" en="Party"/>
					<ReportTableTh ar="المبلغ" en="Amount"/>
					<ReportTableTh ar="المبلغ المدفوع" en="Paid amount"/>
				</tr>
				</thead>
				<tbody>
				{ items.map((invoice, idx) =>
				{
					const isEven = idx % 2 === 0;

					return (
						<tr key={ invoice.id }>
							<ReportTableTd isEven={ isEven }>
								{ idx + 1 + (cubit.currentPage.value - 1) * cubit.pageSize.value }
							</ReportTableTd>

							<ReportTableTd
								isEven={ isEven }
								className="p-0! text-blue-600! hover:bg-blue-100/50! hover:underline! print:text-foreground! print:no-underline! print:bg-transparent!"
							>
								<Link
									to={ `/${ routePrefix }/${ invoice.id }` }
									target="_blank"
									rel="noopener noreferrer"
									className="block w-full h-full p-3"
								>
									{ invoice.id }
								</Link>
							</ReportTableTd>

							<ReportTableTd isEven={ isEven } align="start">
								{ getTypeName(invoice.type) }
							</ReportTableTd>
							<ReportTableTd isEven={ isEven }>{ String(invoice.date).split("T")[0] }</ReportTableTd>
							<ReportTableTd isEven={ isEven } align="start">
								{ invoice.storeName || "-" }
							</ReportTableTd>
							<ReportTableTd isEven={ isEven } align="start">
								{ invoice.partnerName || "-" }
							</ReportTableTd>
							<ReportTableTd isEven={ isEven }>{ formatNumber(invoice.fullAmount) }</ReportTableTd>
							<ReportTableTd
								isEven={ isEven }
								className={
									invoice.fullAmount === invoice.paidAmount
										? "text-green-600!"
										: "text-red-600!"
								}
							>
								{ formatNumber(invoice.paidAmount) }
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