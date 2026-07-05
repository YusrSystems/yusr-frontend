import { ReportTableTh } from "@/features/report/components/reportTableTh.tsx";
import { ReportTableTd } from "@/features/report/components/reportTableTd.tsx";
import { formatNumber } from "@/features/report/utils/formating.ts";
import { Cubits } from "@/core/services/cubits.ts";
import { useSignals } from "@preact/signals-react/runtime";
import { ReportLoaded, ReportLoading, TablePreview } from "yusr-ui";


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

					return (
						<tr key={ `${ row.date }-${ row.documentNumber }-${ idx }` }>
							<ReportTableTd isEven={ isEven }>{ row.date }</ReportTableTd>
							<ReportTableTd isEven={ isEven }>{ row.type }</ReportTableTd>
							<ReportTableTd isEven={ isEven }>{ row.documentNumber.toString() }</ReportTableTd>
							<ReportTableTd isEven={ isEven }>{ formatNumber(row.income) }</ReportTableTd>
							<ReportTableTd isEven={ isEven }>{ formatNumber(row.outcome) }</ReportTableTd>
							<ReportTableTd isEven={ isEven }
							               className="font-bold">{ formatNumber(row.balance) }</ReportTableTd>
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