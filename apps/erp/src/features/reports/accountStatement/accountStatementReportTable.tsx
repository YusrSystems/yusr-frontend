import { ReportTableTh } from "@/features/report/components/reportTableTh.tsx";
import { ReportTableTd } from "@/features/report/components/reportTableTd.tsx";
import { formatNumber } from "@/features/report/utils/formating.ts";
import { Cubits } from "@/core/services/cubits.ts";
import { useSignals } from "@preact/signals-react/runtime";
import { ReportLoaded, ReportLoading, TablePreview } from "yusr-ui";
import { Link } from "react-router-dom";
import { FinancialLedgerDocumentType } from "@/core/data/financialLedger.ts";
import { InvoiceType } from "@/core/types/invoiceType.ts";


function documentRoute(type?: FinancialLedgerDocumentType, invoiceType?: InvoiceType): string | undefined
{
	switch (type)
	{
		case FinancialLedgerDocumentType.Invoice:
			switch (invoiceType)
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
		case FinancialLedgerDocumentType.Voucher:
			return "vouchers";
		case FinancialLedgerDocumentType.BalanceTransfer:
			return "balanceTransfer";
		default:
			return undefined;
	}
}

const linkClassName = "p-0! text-blue-600! hover:bg-blue-100/50! hover:underline! print:text-foreground! print:no-underline! print:bg-transparent!";

export function AccountStatementReportTable()
{
	useSignals();

	if (Cubits.AccountStatementReport.state.value instanceof ReportLoading)
	{
		return <TablePreview.Loading/>;
	}

	if (Cubits.AccountStatementReport.state.value instanceof ReportLoaded)
	{
		const rows = Cubits.AccountStatementReport.result.value?.accountStatementRows ?? [];

		return (
			<table className="w-full mt-5 border-collapse rounded-lg overflow-hidden">
				<thead>
				<tr>
					<ReportTableTh ar="التاريخ" en="Date"/>
					<ReportTableTh ar="النوع" en="Type"/>
					<ReportTableTh ar="رقم المستند" en="Document No."/>
					<ReportTableTh ar="الوارد / له" en="Income"/>
					<ReportTableTh ar="الصادر / عليه" en="Outcome"/>
					<ReportTableTh ar="الرصيد" en="Balance"/>
					<ReportTableTh ar="الملاحظات" en="Notes" align="start"/>
				</tr>
				</thead>
				<tbody>
				{ rows.map((row, idx) =>
				{
					const isEven = idx % 2 === 0;
					const route = row.documentNumber > 0 ? documentRoute(row.documentType, row.invoiceType) : undefined;

					return (
						<tr key={ `${ row.date }-${ row.documentNumber }-${ idx }` }>
							<ReportTableTd isEven={ isEven }>{ row.date }</ReportTableTd>

							<ReportTableTd isEven={ isEven }>
								<div className="flex items-center justify-center gap-1.5">
									<span>{ row.type }</span>
									{ row.editsCount && row.editsCount > 1 && (
										<span
											className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded border border-amber-300 print:border-gray-400 print:bg-transparent print:text-foreground"
											title="عدد التعديلات/الحركات المجمعة"
										>
											مجمع ({ row.editsCount })
										</span>
									) }
								</div>
							</ReportTableTd>

							{ route ? (
								<ReportTableTd isEven={ isEven } className={ linkClassName }>
									<Link
										to={ `/${ route }/${ row.documentNumber }` }
										target="_blank"
										rel="noopener noreferrer"
										className="block w-full h-full"
									>
										{ row.documentNumber }
									</Link>
								</ReportTableTd>
							) : (
								<ReportTableTd isEven={ isEven }>{ row.documentNumber }</ReportTableTd>
							) }
							<ReportTableTd
								isEven={ isEven }
								className={ row.income > 0
									? "text-emerald-600! font-bold! print:font-medium print:text-foreground!"
									: undefined }
							>
								{ row.income > 0 ? formatNumber(row.income) : "-" }
							</ReportTableTd>
							<ReportTableTd
								isEven={ isEven }
								className={ row.outcome > 0
									? "text-destructive! font-bold! print:font-medium print:text-foreground!"
									: undefined }
							>
								{ row.outcome > 0 ? formatNumber(row.outcome) : "-" }
							</ReportTableTd>
							<ReportTableTd
								isEven={ isEven }
								className={ row.balance >= 0
									? "text-emerald-600! font-bold! print:font-medium print:text-foreground!"
									: "text-destructive! font-bold! print:font-medium print:text-foreground!" }
							>
								{ formatNumber(row.balance) }
							</ReportTableTd>
							<ReportTableTd isEven={ isEven } align="start">{ row.notes }</ReportTableTd>
						</tr>
					);
				}) }
				</tbody>
			</table>
		);
	}

	return <TablePreview.Empty/>;
}