import { ReportField } from "@/features/report/components/reportField.tsx";
import { formatNumber } from "@/features/report/utils/formating.ts";
import type { AccountStatementReportResult } from "@/features/reports/accountStatement/accountStatementReportResult.ts";
import { AccountClass } from "@/core/data/account.ts";


interface AccountStatementReportInfoProps
{
	data: AccountStatementReportResult;
}

export function AccountStatementReportInfo({data}: AccountStatementReportInfoProps)
{
	const {account} = data;

	const isDebitNormal = data.account.class === AccountClass.Asset || data.account.class === AccountClass.Expense;

	const debitLabelAr = isDebitNormal ? "إجمالي المبالغ الداخلة (الحركات المدينة)" : "إجمالي المبالغ الخارجة (الحركات المدينة)";
	const debitLabelEn = isDebitNormal ? "Total Incoming Amount (Total Debits)" : "Total Outgoing Amount (Total Debits)";

	const creditLabelAr = isDebitNormal ? "إجمالي المبالغ الخارجة (الحركات الدائنة)" : "إجمالي المبالغ الداخلة (الحركات الدائنة)";
	const creditLabelEn = isDebitNormal ? "Total Outgoing Amount (Total Credits)" : "Total Incoming Amount (Total Credits)";

	return (
		<div className="flex flex-col gap-3 my-4 print:break-inside-avoid">

			<div className="grid grid-cols-2 gap-3">
				<ReportField labelAr="رقم الحساب" labelEn="Account Id" value={ account.id.toString() }/>
				<ReportField labelAr="اسم الحساب" labelEn="Account Name" value={ account.name }/>
			</div>


			<div className="grid grid-cols-2 gap-3 mt-2 pt-2">
				<ReportField labelAr="الرصيد قبل بداية الفترة" labelEn="Balance before start date"
				             valueClassName="font-bold!"
				             value={ formatNumber(data.openingBalanceBeforePeriod) }/>
				<ReportField labelAr="الرصيد النهائي في نهاية الفترة" labelEn="Final balance at end date"
				             valueClassName="font-bold!"
				             value={ formatNumber(data.closingBalanceAfterPeriod) }/>
			</div>

			<div className="grid grid-cols-1 gap-3">
				<ReportField
					labelAr={ debitLabelAr }
					labelEn={ debitLabelEn }
					value={ formatNumber(data.pageTotalDebits) }
				/>

				<ReportField
					labelAr={ creditLabelAr }
					labelEn={ creditLabelEn }
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