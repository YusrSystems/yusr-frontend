import { useEffect } from "react";
import { useSignals } from "@preact/signals-react/runtime";
import { CrudTablePagination, FilterSection, SystemPermissionsActions } from "yusr-ui";
import { Cubits } from "@/core/services/cubits.ts";
import ReportPage from "@/features/report/reportPage.tsx";
import { AccountsListReport } from "@/features/reports/accountsList/accountsListReport.tsx";
import { type AccountDto } from "@/core/data/account.ts";
import { APP_NAME } from "../../../../appConfig.ts";
import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources.ts";
import { Services } from "@/core/services/services.ts";


export function AccountsListReportPage()
{
	useSignals();

	useEffect(() =>
	{
		if (!Services.auth.hasAuth(SystemPermissionsResources.ReportAccountList, SystemPermissionsActions.Get)) return;
		Cubits.accounts.init(undefined, undefined, 1000); // Initialize your accounting Cubit
	}, []);

	useEffect(() =>
	{
		document.title = "قائمة الحسابات";

		return () =>
		{
			document.title = APP_NAME;
		};
	}, []);

	return (
		<ReportPage permissionResource={ SystemPermissionsResources.ReportAccountList }>

			<ReportPage.ActionButtonsContainer>
				<ReportPage.ExcelButton<AccountDto>
					fileName="تقرير_قائمة_الحسابات"
					getRows={ async () => Cubits.accounts.entities.value ?? [] }
					columns={ [
						{header: "اسم الحساب", accessor: (r) => r.name}
					] }
				/>
				<ReportPage.PrintButton/>
			</ReportPage.ActionButtonsContainer>

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