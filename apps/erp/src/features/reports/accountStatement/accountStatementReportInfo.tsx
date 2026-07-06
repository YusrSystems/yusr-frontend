import { ReportField } from "@/features/report/components/reportField.tsx";
import { formatNumber } from "@/features/report/utils/formating.ts";
import type { AccountStatementReportResult } from "@/features/reports/accountStatement/accountStatementReportResult.ts";
import { Account } from "@/core/data/account.ts";


interface AccountStatementReportInfoProps
{
	data: AccountStatementReportResult;
}

export function AccountStatementReportInfo({data}: AccountStatementReportInfoProps)
{
	const {account} = data;

	return (
		<div className="flex flex-col gap-3 my-4 print:break-inside-avoid">

			<div className="grid grid-cols-2 gap-3">
				<ReportField labelAr="رقم الحساب" labelEn="Account Id" value={ account.id.toString() }/>
				<ReportField labelAr="اسم الحساب" labelEn="Account Name" value={ account.name }/>
			</div>

			<div className="grid grid-cols-2 gap-3">
				{ account.vatNumber &&
                    <ReportField labelAr="الرقم الضريبي" labelEn="Tax Number" value={ account.vatNumber ?? "" }/> }
				{ account.accountContacts[0]?.number &&
                    <ReportField labelAr="الهاتف" labelEn="Phone" value={ account.accountContacts[0]?.number ?? "" }/> }
			</div>

			<div className="grid grid-cols-1 gap-3">
				<ReportField labelAr="العنوان" labelEn="Address" value={ Account.formatAddress(account) }/>
			</div>

			<div className="grid grid-cols-2 gap-3 mt-2 pt-2">
				<ReportField labelAr="رصيد الفترة" labelEn="Period Balance" valueClassName="font-bold!"
				             value={ formatNumber(data.periodBalance) }/>
				<ReportField labelAr="الرصيد الكلي" labelEn="Total Balance" valueClassName="font-bold!"
				             value={ formatNumber(account.balance) }/>
			</div>

			<div className="grid grid-cols-2 gap-3">
				<ReportField labelAr="إجمالي الوارد / له" labelEn="Total Income"
				             value={ formatNumber(data.totalIncome) }/>
				<ReportField labelAr="إجمالي الصادر / عليه" labelEn="Total Outcome"
				             value={ formatNumber(data.totalOutcome) }/>
			</div>

			{ account.notes && (
				<div className="grid grid-cols-1 gap-3">
					<ReportField labelAr="ملاحظات" labelEn="Notes" value={ account.notes }/>
				</div>
			) }
		</div>
	);
}