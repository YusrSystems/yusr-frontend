import { useSignals } from "@preact/signals-react/runtime";
import { Link } from "react-router-dom";
import { PageError, PageLoaded, PageLoading, TablePreview } from "yusr-ui";
import { Cubits } from "@/core/services/cubits.ts";
import { ReportTableTh } from "@/features/report/components/reportTableTh.tsx";
import { ReportTableTd } from "@/features/report/components/reportTableTd.tsx";
import { formatNumber } from "@/features/report/utils/formating.ts";


export function AccountsListReportTable()
{
	useSignals();

	if (Cubits.accounts.state.value instanceof PageLoading)
	{
		return <TablePreview.Loading/>;
	}

	if (Cubits.accounts.state.value instanceof PageError)
	{
		return <TablePreview.Error/>;
	}

	if (Cubits.accounts.state.value instanceof PageLoaded)
	{
		return (
			<table className="w-full mt-5 border-collapse rounded-lg overflow-hidden">
				<thead>
				<tr>
					<ReportTableTh ar="الرقم" en="No."/>
					<ReportTableTh ar="رقم الحساب" en="Account Id"/>
					<ReportTableTh ar="اسم الحساب" en="Account Name"/>
					<ReportTableTh ar="الرصيد الافتتاحي" en="Initial Balance"/>
					<ReportTableTh ar="الرصيد" en="Balance"/>
				</tr>
				</thead>
				<tbody>
				{ Cubits.accounts.entities.value.map((account, idx) =>
				{
					const isEven = idx % 2 === 0;

					return (
						<tr key={ account.id }>
							<ReportTableTd isEven={ isEven }>
								{ idx + 1 + ((Cubits.accounts.currentPage.value - 1) * Cubits.accounts.pageSize.value) }
							</ReportTableTd>

							<ReportTableTd
								isEven={ isEven }
								className="p-0! text-blue-600! hover:bg-blue-100/50! hover:underline! print:text-foreground! print:no-underline! print:bg-transparent!"
							>
								<Link
									to="/accounts"
									target="_blank"
									rel="noopener noreferrer"
									className="block w-full h-full p-3"
								>
									{ account.id }
								</Link>
							</ReportTableTd>

							<ReportTableTd isEven={ isEven } align="start">
								{ account.name }
							</ReportTableTd>

							<ReportTableTd isEven={ isEven }>
								{ formatNumber(account.openingBalance ?? 0) }
							</ReportTableTd>

							<ReportTableTd isEven={ isEven } className="font-semibold text-foreground!">
								{ formatNumber(account.balance ?? 0) }
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