import { ReportTableTh } from "@/features/report/components/reportTableTh.tsx";
import { ReportTableTd } from "@/features/report/components/reportTableTd.tsx";
import { formatNumber } from "@/features/report/utils/formating.ts";
import { Cubits } from "@/core/services/cubits.ts";
import { useSignals } from "@preact/signals-react/runtime";
import { ReportLoaded, ReportLoading, TablePreview } from "yusr-ui";
import { Link } from "react-router-dom";
import { getDocumentRoute, getDocumentTypeName } from "@/core/types/documentType.ts";
import { AccountClass } from "@/core/data/account.ts";


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
		const rows = Cubits.AccountStatementReport.result.value?.lines ?? [];

		const accountClass = Cubits?.AccountStatementReport?.result.value?.account.class ?? AccountClass.Asset;
		const isDebitNormal =
			accountClass === AccountClass.Asset ||
			accountClass === AccountClass.Expense;

		const debitAr = isDebitNormal ? "المبالغ الداخلة (مدين)" : "المبالغ الخارجة (مدين)";
		const debitEn = isDebitNormal ? "Incoming (Debit)" : "Outgoing (Debit)";

		const creditAr = isDebitNormal ? "المبالغ الخارجة (دائن)" : "المبالغ الداخلة (دائن)";
		const creditEn = isDebitNormal ? "Outgoing (Credit)" : "Incoming (Credit)";

		return (
			<table className="w-full mt-5 border-collapse rounded-lg overflow-hidden">
				<thead>
				<tr>
					<ReportTableTh ar="التاريخ" en="Date"/>
					<ReportTableTh ar="نوع المستند" en="Doc Type"/>
					<ReportTableTh ar="رقم المستند" en="Doc No."/>
					<ReportTableTh ar="الشريك" en="Partner"/>
					<ReportTableTh ar="شرح القيد" en="Narration" align="start"/>
					<ReportTableTh ar="البيان" en="Description" align="start"/>
					<ReportTableTh ar={ debitAr } en={ debitEn }/>
					<ReportTableTh ar={ creditAr } en={ creditEn }/>
					<ReportTableTh ar="الرصيد" en="Balance"/>
				</tr>
				</thead>
				<tbody>
				{ rows.map((row, idx) =>
				{
					const isEven = idx % 2 === 0;
					const route = row.documentId > 0 ? getDocumentRoute(row.documentType) : undefined;

					const favorableWhenPositive =
						accountClass === AccountClass.Asset ||
						accountClass === AccountClass.Revenue ||
						accountClass === AccountClass.Equity;

					const greenColorClass = "text-emerald-600! font-bold! print:font-medium print:text-foreground!";
					const redColorClass = "text-destructive! font-bold! print:font-medium print:text-foreground!";

					const debitClassName = row.debit > 0
						? (favorableWhenPositive && isDebitNormal ? greenColorClass : redColorClass)
						: undefined;

					const creditClassName = row.credit > 0
						? (favorableWhenPositive && !isDebitNormal ? greenColorClass : redColorClass)
						: undefined;

					const runningBalanceClassName = row.runningBalance < 0
						? redColorClass
						: (favorableWhenPositive ? greenColorClass : redColorClass);

					return (
						<tr key={ `${ row.id }-${ idx }` }>
							<ReportTableTd isEven={ isEven }>{ row.date }</ReportTableTd>

							<ReportTableTd isEven={ isEven }>
								{ getDocumentTypeName(row.documentType) }
							</ReportTableTd>

							{ route ? (
								<ReportTableTd isEven={ isEven } className={ linkClassName }>
									<Link
										to={ `/${ route }/${ row.documentId }` }
										target="_blank"
										rel="noopener noreferrer"
										className="block w-full h-full"
									>
										{ row.documentId }
									</Link>
								</ReportTableTd>
							) : (
								<ReportTableTd
									isEven={ isEven }>{ row.documentId > 0 ? row.documentId : "-" }</ReportTableTd>
							) }

							<ReportTableTd isEven={ isEven }>{ row.partnerName || "-" }</ReportTableTd>
							<ReportTableTd isEven={ isEven }>{ row.narration || "-" }</ReportTableTd>
							<ReportTableTd isEven={ isEven } align="start">{ row.description || "-" }</ReportTableTd>

							<ReportTableTd
								isEven={ isEven }
								className={ debitClassName }
							>
								{ formatNumber(row.debit) }
							</ReportTableTd>
							<ReportTableTd
								isEven={ isEven }
								className={ creditClassName }
							>
								{ formatNumber(row.credit) }
							</ReportTableTd>
							<ReportTableTd
								isEven={ isEven }
								className={ runningBalanceClassName }
							>
								{ formatNumber(row.runningBalance) }
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