import { useSignals } from "@preact/signals-react/runtime";
import { ReportLoading, TablePreview } from "yusr-ui";
import { Cubits } from "@/core/services/cubits.ts";
import { BalanceSheetReportRow, BalanceSheetTreeNode } from "@/features/reports/balanceSheet/balanceSheetReportRow.tsx";
import { formatNumber } from "@/features/report/utils/formating.ts";


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
				{ data.assetTree?.map(node => (
					<BalanceSheetTreeNode key={ node.glAccountId } node={ node }/>
				)) }
				<BalanceSheetReportRow.Total value={ data.totalAssets }/>
			</div>

			<div className="border border-border rounded-md overflow-hidden">
				<BalanceSheetReportRow.SectionHeader titleAr="2- الخصوم" titleEn="2- Liabilities"/>
				{ data.liabilityTree?.map(node => (
					<BalanceSheetTreeNode key={ node.glAccountId } node={ node }/>
				)) }
				<BalanceSheetReportRow.Total value={ data.totalLiabilities }/>
			</div>

			<div className="border border-border rounded-md overflow-hidden">
				<BalanceSheetReportRow.SectionHeader titleAr="3- حقوق الملكية" titleEn="3- Owner's Equity"/>
				{ data.equityTree?.map(node => (
					<BalanceSheetTreeNode key={ node.glAccountId } node={ node }/>
				)) }

				<BalanceSheetReportRow
					labelAr="أرباح مبقاة لسنوات سابقة"
					labelEn="Prior Years Retained Earnings"
					value={ data.totalPriorYearsRetainedEarnings }
					isBold
				/>
				<BalanceSheetReportRow
					labelAr="أرباح العام الحالي"
					labelEn="Current Year Earnings"
					value={ data.totalCurrentYearEarnings }
					isBold
				/>

				<BalanceSheetReportRow.Total value={ data.totalEquity }/>
			</div>

			<div className="border border-border rounded-md overflow-hidden">
				<div
					className="grid grid-cols-3 items-center gap-3 px-3 py-3 bg-primary text-primary-foreground print:break-inside-avoid">
					<p className="text-sm font-bold">إجمالي الخصوم وحقوق الملكية</p>
					<div
						className="text-center font-bold text-lg">{ formatNumber(data.totalLiabilitiesAndEquity) }</div>
					<p className="text-sm font-bold" dir="ltr">Total Liabilities & Equity</p>
				</div>
			</div>
		</div>
	);
}