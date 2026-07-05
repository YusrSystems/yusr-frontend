import { useSignals } from "@preact/signals-react/runtime";
import { ReportLoading, TablePreview } from "yusr-ui";
import { Cubits } from "@/core/services/cubits.ts";
import { BalanceSheetReportRow } from "@/features/reports/balanceSheet/balanceSheetReportRow.tsx";
import {
	getOwnerEquity,
	getTotalAssets,
	getTotalLiabilities
} from "@/features/reports/balanceSheet/balanceSheetReportResult.ts";


export function BalanceSheetReportTable()
{
	useSignals();

	if (Cubits.BalanceSheetReport.state.value instanceof ReportLoading)
	{
		return <TablePreview.Loading/>;
	}

	const data = Cubits.BalanceSheetReport.result.value;

	if (!data)
	{
		return <TablePreview.Empty/>;
	}

	return (
		<div className="flex flex-col gap-6 mt-5">
			<div className="border border-border rounded-md overflow-hidden">
				<BalanceSheetReportRow.SectionHeader titleAr="1- الأصول" titleEn="1- Assets"/>
				<BalanceSheetReportRow labelAr="1- النقدية بالصناديق" labelEn="1- Cash on Hand"
				                       value={ data.boxesBalance }/>
				<BalanceSheetReportRow labelAr="2- النقدية بالبنوك" labelEn="2- Cash at Banks"
				                       value={ data.banksBalance }/>
				<BalanceSheetReportRow labelAr="3- أرصدة المدينين" labelEn="3- Debtors' balances"
				                       value={ data.debtorsBalance }/>
				<BalanceSheetReportRow labelAr="4- تكلفة المواد" labelEn="4- Items Cost" value={ data.itemsCost }/>
				<BalanceSheetReportRow.Total value={ getTotalAssets(data) }/>
			</div>

			<div className="border border-border rounded-md overflow-hidden">
				<BalanceSheetReportRow.SectionHeader titleAr="2- الخصوم" titleEn="2- Liabilities"/>
				<BalanceSheetReportRow labelAr="1- أرصدة الدائنين" labelEn="1- Creditors' balances"
				                       value={ data.creditorsBalance }/>
				<BalanceSheetReportRow.Total value={ getTotalLiabilities(data) }/>
			</div>

			<div className="border border-border rounded-md overflow-hidden">
				<BalanceSheetReportRow.SectionHeader titleAr="3- حقوق الملكية" titleEn="3- Owner's Equity"/>
				<BalanceSheetReportRow.Total value={ getOwnerEquity(data) }/>
			</div>
		</div>
	);
}