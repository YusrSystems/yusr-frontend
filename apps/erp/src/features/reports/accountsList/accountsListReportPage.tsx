import { useEffect } from "react";
import { useSignals } from "@preact/signals-react/runtime";
import { CrudTablePagination, FilterSection } from "yusr-ui";
import { Cubits } from "@/core/services/cubits.ts";
import ReportPage from "@/features/report/reportPage.tsx";
import { AccountsListReport } from "@/features/reports/accountsList/accountsListReport.tsx";
import { type AccountDto } from "@/core/data/account.ts";


export function AccountsListReportPage()
{
	useSignals();

	useEffect(() =>
	{
		Cubits.accounts.init(undefined, undefined, 1000); // Initialize your accounting Cubit
	}, []);

	return (
		<ReportPage>

			<ReportPage.ActionButtonsContainer>
				<ReportPage.ExcelButton<AccountDto>
					fileName="تقرير_قائمة_الحسابات"
					getRows={ async () => Cubits.accounts.entities.value ?? [] }
					columns={ [
						{header: "اسم الحساب", accessor: (r) => r.name}
						// {header: "نوع الحساب", accessor: (r) => Account.getAccountTypeName(r.type)},
						// {header: "الرصيد الافتتاحي", accessor: (r) => r.initialBalance},
						// {header: "الرصيد الحالي", accessor: (r) => r.balance},
						// {header: "الرقم الضريبي", accessor: (r) => r.vatNumber ?? ""},
						// {header: "السجل التجاري", accessor: (r) => r.crn ?? ""},
						// {header: "رقم حساب الأب", accessor: (r) => r.parentId ?? ""},
						// {header: "اسم حساب الأب", accessor: (r) => r.parentName ?? ""},
						// {header: "رقم الحساب البنكي", accessor: (r) => r.bankAccountNumber ?? ""},
						// {header: "الدولة", accessor: (r) => r.city?.country?.name ?? ""},
						// {header: "المدينة", accessor: (r) => r.cityName ?? ""},
						// {header: "الحي", accessor: (r) => r.district ?? ""},
						// {header: "الشارع", accessor: (r) => r.street ?? ""},
						// {header: "رقم المبنى", accessor: (r) => r.buildingNumber ?? ""},
						// {header: "الرمز البريدي", accessor: (r) => r.postalCode ?? ""},
						// {header: "ملاحظات", accessor: (r) => r.notes ?? ""},
						// {
						// 	header: "جهات الاتصال",
						// 	accessor: (r) => r.accountContacts.map(c => `${ c.number }`).join("، ")
						// }
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