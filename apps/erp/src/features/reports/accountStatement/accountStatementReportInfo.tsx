import { ReportField } from "@/features/report/components/reportField.tsx";
import { formatNumber } from "@/features/report/utils/formating.ts";
import type { AccountStatementReportResult } from "@/features/reports/accountStatement/accountStatementReportResult.ts";


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


			<div className="grid grid-cols-2 gap-3 mt-2 pt-2">
				<ReportField labelAr="الرصيد الافتتاحي (قبل الفترة)" labelEn="Opening Balance"
				             valueClassName="font-bold!"
				             value={ formatNumber(data.openingBalanceBeforePeriod) }/>
				<ReportField labelAr="الرصيد الختامي (بعد الفترة)" labelEn="Closing Balance" valueClassName="font-bold!"
				             value={ formatNumber(data.closingBalanceAfterPeriod) }/>
			</div>

			<div className="grid grid-cols-1 gap-3">
				<ReportField
					labelAr="إجمالي المبالغ الداخل (إجمالي مدين)"
					labelEn="Total Incoming Amount (Total Debits)"
					value={ formatNumber(data.pageTotalDebits) }
				/>

				<ReportField
					labelAr="إجمالي المبالغ الخارجة (إجمالي دائن)"
					labelEn="Total Outgoing Amount (Total Credits)"
					value={ formatNumber(data.pageTotalCredits) }
				/>
			</div>

			{ account.notes && (
				<div className="grid grid-cols-1 gap-3">
					<ReportField labelAr="ملاحظات" labelEn="Notes" value={ account.notes }/>
				</div>
			) }
		</div>
	);
}