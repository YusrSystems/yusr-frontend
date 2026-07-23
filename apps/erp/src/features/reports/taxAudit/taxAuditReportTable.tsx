import { ReportTableTh } from "@/features/report/components/reportTableTh";
import { ReportTableTd } from "@/features/report/components/reportTableTd";
import { formatNumber } from "@/features/report/utils/formating";
import { Cubits } from "@/core/services/cubits";
import { useSignals } from "@preact/signals-react/runtime";
import { ReportLoaded, ReportLoading, TablePreview } from "yusr-ui";
import { Link } from "react-router-dom";
import { InvoiceType } from "@/core/types/invoiceType";


const linkClassName = "p-0! text-blue-600! hover:bg-blue-100/50! hover:underline! print:text-foreground! print:no-underline! print:bg-transparent!";

export function getInvoiceTypeNameAr(type: InvoiceType): string
{
	switch (type)
	{
		case InvoiceType.Sell:
			return "فاتورة مبيعات";
		case InvoiceType.SellReturn:
			return "مرتجع مبيعات";
		case InvoiceType.Purchase:
			return "فاتورة مشتريات";
		case InvoiceType.PurchaseReturn:
			return "مرتجع مشتريات";
		case InvoiceType.Quotation:
			return "عرض سعر";
		default:
			return "غير معروف";
	}
}

export function getInvoiceRoute(type: InvoiceType): string | undefined
{
	switch (type)
	{
		case InvoiceType.Sell:
		case InvoiceType.SellReturn:
			return "sales";
		case InvoiceType.Purchase:
		case InvoiceType.PurchaseReturn:
			return "purchases";
		case InvoiceType.Quotation:
			return "quotations";
		default:
			return undefined;
	}
}

export function TaxAuditReportTable()
{
	useSignals();

	if (Cubits.TaxAuditReport.state.value instanceof ReportLoading)
	{
		return <TablePreview.Loading/>;
	}

	if (Cubits.TaxAuditReport.state.value instanceof ReportLoaded)
	{
		const lines = Cubits.TaxAuditReport.result.value?.lines ?? [];

		return (
			<table className="w-full mt-5 border-collapse rounded-lg overflow-hidden">
				<thead>
				<tr>
					<ReportTableTh ar="التاريخ" en="Date"/>
					<ReportTableTh ar="نوع المستند" en="Doc Type"/>
					<ReportTableTh ar="رقم المستند" en="Doc No."/>
					<ReportTableTh ar="الشريك" en="Partner" align="start"/>
					<ReportTableTh ar="الرقم الضريبي" en="VAT No." align="start"/>
					<ReportTableTh ar="المادة" en="Item" align="start"/>
					<ReportTableTh ar="الكمية" en="Qty"/>
					<ReportTableTh ar="نسبة الضريبة" en="Tax Rate"/>
					<ReportTableTh ar="المبلغ (غير شامل)" en="Tax Excl."/>
					<ReportTableTh ar="الضريبة" en="Tax Amt"/>
					<ReportTableTh ar="الإجمالي" en="Total"/>
				</tr>
				</thead>
				<tbody>
				{ lines.map((row, idx) =>
				{
					const isEven = idx % 2 === 0;
					const routePath = getInvoiceRoute(row.invoiceType);

					return (
						<tr key={ `${ row.invoiceId }-${ idx }` }>
							<ReportTableTd className="min-w-20" isEven={ isEven }>{ row.date }</ReportTableTd>
							<ReportTableTd isEven={ isEven }>{ getInvoiceTypeNameAr(row.invoiceType) }</ReportTableTd>

							{ routePath ? (
								<ReportTableTd isEven={ isEven } className={ linkClassName }>
									<Link
										to={ `/${ routePath }/${ row.invoiceId }` }
										target="_blank"
										rel="noopener noreferrer"
										className="block w-full h-full"
									>
										{ row.invoiceId }
									</Link>
								</ReportTableTd>
							) : (
								<ReportTableTd isEven={ isEven }>{ row.invoiceId || "-" }</ReportTableTd>
							) }

							<ReportTableTd isEven={ isEven } align="start">{ row.partnerName || "-" }</ReportTableTd>
							<ReportTableTd isEven={ isEven }
							               align="start">{ row.partnerVatNumber || "-" }</ReportTableTd>
							<ReportTableTd isEven={ isEven } align="start">{ row.itemName || "-" }</ReportTableTd>

							<ReportTableTd isEven={ isEven }>{ formatNumber(row.quantity) }</ReportTableTd>
							<ReportTableTd isEven={ isEven }>{ row.taxRate }%</ReportTableTd>
							<ReportTableTd isEven={ isEven }>{ formatNumber(row.taxExclusiveAmount) }</ReportTableTd>
							<ReportTableTd isEven={ isEven } className="text-red-600! font-semibold!">
								{ formatNumber(row.taxAmount) }
							</ReportTableTd>
							<ReportTableTd isEven={ isEven } className="text-blue-600! font-bold!">
								{ formatNumber(row.taxInclusiveAmount) }
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