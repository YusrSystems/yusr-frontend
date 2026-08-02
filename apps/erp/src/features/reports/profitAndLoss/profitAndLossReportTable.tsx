import { useSignals } from "@preact/signals-react/runtime";
import { ReportLoading, TablePreview } from "yusr-ui";
import { Cubits } from "@/core/services/cubits.ts";
import {
	ProfitAndLossReportRow,
	ProfitAndLossTreeNode
} from "@/features/reports/profitAndLoss/profitAndLossReportRow.tsx";
import { formatNumber } from "@/features/report/utils/formating.ts";


export function ProfitAndLossReportTable()
{
	useSignals();

	if (Cubits.ProfitAndLossReport.state.value instanceof ReportLoading)
	{
		return <TablePreview.Loading/>;
	}

	const data = Cubits.ProfitAndLossReport.result.value;

	if (!data)
	{
		return <TablePreview.Empty/>;
	}

	return (
		<div className="flex flex-col gap-6 mt-5">
			<div className="border border-border rounded-md overflow-hidden">
				<ProfitAndLossReportRow.SectionHeader titleAr="1- الإيرادات" titleEn="1- Revenues"/>
				{ data.revenueTree?.map(node => (
					<ProfitAndLossTreeNode key={ node.glAccountId } node={ node }/>
				)) }
				<ProfitAndLossReportRow.Total value={ data.totalRevenue }/>
			</div>

			<div className="border border-border rounded-md overflow-hidden">
				<ProfitAndLossReportRow.SectionHeader titleAr="2- تكلفة البضاعة المباعة"
				                                      titleEn="2- Cost of Goods Sold"/>
				<ProfitAndLossReportRow
					labelAr="إجمالي تكلفة البضاعة المباعة"
					labelEn="Total COGS"
					value={ data.totalCogs }
				/>
			</div>

			<div className="border border-border rounded-md overflow-hidden">
				<div className="grid grid-cols-3 items-center gap-3 px-3 py-3 bg-primary/10 print:break-inside-avoid">
					<p className="text-sm font-bold text-primary">إجمالي الربح (الخسارة)</p>
					<div
						className={ `text-center font-bold text-lg ${ data.grossProfit >= 0 ? "text-emerald-600" : "text-destructive" }` }>
						{ formatNumber(data.grossProfit) }
					</div>
					<p className="text-sm font-bold text-primary" dir="ltr">Gross Profit (Loss)</p>
				</div>
			</div>

			<div className="border border-border rounded-md overflow-hidden">
				<ProfitAndLossReportRow.SectionHeader titleAr="3- المصروفات التشغيلية" titleEn="3- Operating Expenses"/>
				{ data.expenseTree?.map(node => (
					<ProfitAndLossTreeNode key={ node.glAccountId } node={ node }/>
				)) }
				<ProfitAndLossReportRow.Total value={ data.totalExpense }/>
			</div>

			<div className="border border-border rounded-md overflow-hidden">
				<div
					className="grid grid-cols-3 items-center gap-3 px-3 py-3 bg-primary text-primary-foreground print:break-inside-avoid">
					<p className="text-sm font-bold">صافي الربح (الخسارة)</p>
					<div
						className={ `text-center font-bold text-lg ${ data.netProfit >= 0 ? "text-emerald-400" : "text-red-400" }` }>
						{ formatNumber(data.netProfit) }
					</div>
					<p className="text-sm font-bold" dir="ltr">Net Profit (Loss)</p>
				</div>
			</div>
		</div>
	);
}