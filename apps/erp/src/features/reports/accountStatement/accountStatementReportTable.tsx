import { ReportTableTh } from "@/features/report/components/reportTableTh.tsx";
import { ReportTableTd } from "@/features/report/components/reportTableTd.tsx";
import { formatNumber } from "@/features/report/utils/formating.ts";
import { Cubits } from "@/core/services/cubits.ts";
import { useSignals } from "@preact/signals-react/runtime";
import { ReportLoaded, ReportLoading, TablePreview } from "yusr-ui";
import { Link } from "react-router-dom";
import { getDocumentRoute, getDocumentTypeName } from "@/core/types/documentType.ts";


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

		return (
			<table className="w-full mt-5 border-collapse rounded-lg overflow-hidden">
				<thead>
				<tr>
					<ReportTableTh ar="التاريخ" en="Date"/>
					<ReportTableTh ar="نوع المستند" en="Doc Type"/>
					<ReportTableTh ar="رقم المستند" en="Doc No."/>
					<ReportTableTh ar="الشريك" en="Partner"/>
					<ReportTableTh ar="البيان" en="Description" align="start"/>
					<ReportTableTh ar="مدين" en="Debit"/>
					<ReportTableTh ar="دائن" en="Credit"/>
					<ReportTableTh ar="الرصيد" en="Balance"/>
				</tr>
				</thead>
				<tbody>
				{ rows.map((row, idx) =>
				{
					const isEven = idx % 2 === 0;
					const route = row.documentId > 0 ? getDocumentRoute(row.documentType) : undefined;

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
							<ReportTableTd isEven={ isEven } align="start">{ row.description || "-" }</ReportTableTd>

							<ReportTableTd
								isEven={ isEven }
								className={ row.debit > 0
									? "text-emerald-600! font-bold! print:font-medium print:text-foreground!"
									: undefined }
							>
								{ row.debit > 0 ? formatNumber(row.debit) : "-" }
							</ReportTableTd>
							<ReportTableTd
								isEven={ isEven }
								className={ row.credit > 0
									? "text-destructive! font-bold! print:font-medium print:text-foreground!"
									: undefined }
							>
								{ row.credit > 0 ? formatNumber(row.credit) : "-" }
							</ReportTableTd>
							<ReportTableTd
								isEven={ isEven }
								className={ row.runningBalance >= 0
									? "text-emerald-600! font-bold! print:font-medium print:text-foreground!"
									: "text-destructive! font-bold! print:font-medium print:text-foreground!" }
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