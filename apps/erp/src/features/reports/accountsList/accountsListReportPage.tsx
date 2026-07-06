import { useEffect } from "react";
import { useSignals } from "@preact/signals-react/runtime";
import { CrudTablePagination, FilterSection } from "yusr-ui";
import { Cubits } from "@/core/services/cubits.ts";
import ReportPage from "@/features/report/reportPage.tsx";
import { AccountsListReport } from "@/features/reports/accountsList/accountsListReport.tsx";


export function AccountsListReportPage()
{
	useSignals();

	useEffect(() =>
	{
		Cubits.accounts.init(undefined, undefined, 1000); // Initialize your accounting Cubit
	}, []);

	return (
		<ReportPage>
			<div className="print:hidden w-full shrink-0">
				<FilterSection
					fieldsCubit={ Cubits.accountFilterFields }
					onApply={ (groups) => Cubits.accounts.applyFilterGroups(groups) }
					onClear={ () => Cubits.accounts.clearFilterGroups() }
				/>
			</div>

			<div className="flex-1 min-h-0 flex flex-col print:block">
				<AccountsListReport/>
			</div>

			<CrudTablePagination
				className="print:hidden w-full bg-card text-card-foreground border border-t-0 p-4 shadow-sm rounded-b-xl shrink-0"
				pageSize={ Cubits.accounts.pageSize.value }
				totalNumber={ Cubits.accounts.count.value }
				currentPage={ Cubits.accounts.currentPage.value }
				onPageChanged={ (newPage) =>
				{
					Cubits.accounts.changePage(newPage);
				} }
			/>
		</ReportPage>
	);
}