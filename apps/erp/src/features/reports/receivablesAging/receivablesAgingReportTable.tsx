import { useSignals } from "@preact/signals-react/runtime";
import { Link } from "react-router-dom";
import { ReportError, ReportLoaded, ReportLoading, TablePreview } from "yusr-ui";
import { ReportTableTh } from "@/features/report/components/reportTableTh";
import { ReportTableTd } from "@/features/report/components/reportTableTd";
import { formatNumber } from "@/features/report/utils/formating";
import { Cubits } from "@/core/services/cubits";
import { getReceivablesAgingBucketBadge, ReceivablesAgingViewMode } from "@/core/types/receivablesAging";


const linkClassName =
	"p-0! text-blue-600! hover:bg-blue-100/50! hover:underline! print:text-foreground! print:no-underline! print:bg-transparent!";

export function ReceivablesAgingReportTable()
{
	useSignals();
	const cubit = Cubits.receivablesAgingReport;

	if (cubit.state.value instanceof ReportLoading)
	{
		return <TablePreview.Loading/>;
	}

	if (cubit.state.value instanceof ReportError)
	{
		return <TablePreview.Error/>;
	}

	if (cubit.state.value instanceof ReportLoaded)
	{
		const data = cubit.result.value;
		if (!data || (data.customers.length === 0 && data.invoices.length === 0))
		{
			return <TablePreview.Empty title="لا توجد فواتير أو ذمم مستحقة"/>;
		}

		if (data.viewMode === ReceivablesAgingViewMode.Detailed)
		{
			return <DetailedInvoicesTable data={ data }/>;
		}

		return <SummaryCustomersTable data={ data }/>;
	}

	return <TablePreview.Empty/>;
}

function SummaryCustomersTable({data}: { data: NonNullable<typeof Cubits.receivablesAgingReport.result.value> })
{
	const rows = data.customers ?? [];

	return (
		<table className="w-full mt-4 border-collapse rounded-lg overflow-hidden">
			<thead>
			<tr>
				<ReportTableTh ar="الرقم" en="No."/>
				<ReportTableTh ar="رقم العميل" en="Customer ID"/>
				<ReportTableTh ar="اسم العميل" en="Customer Name" align="start"/>
				<ReportTableTh ar="الجوال / الهاتف" en="Contact"/>
				<ReportTableTh ar="الفواتير" en="Invoices"/>
				<ReportTableTh ar="حالي (غير مستحق)" en="Current"/>
				<ReportTableTh ar="1 - 30 يوم" en="1-30 Days"/>
				<ReportTableTh ar="31 - 60 يوم" en="31-60 Days"/>
				<ReportTableTh ar="61 - 90 يوم" en="61-90 Days"/>
				<ReportTableTh ar="+90 يوم" en="90+ Days"/>
				<ReportTableTh ar="إجمالي الرصيد" en="Total Balance"/>
			</tr>
			</thead>
			<tbody>
			{ rows.map((c, idx) =>
			{
				const isEven = idx % 2 === 0;
				return (
					<tr key={ c.partnerId }>
						<ReportTableTd isEven={ isEven }>
							{ idx + 1 + ((data.pageNumber - 1) * data.rowsPerPage) }
						</ReportTableTd>
						<ReportTableTd isEven={ isEven } className={ linkClassName }>
							<Link
								to={ `/clients/${ c.partnerId }` }
								target="_blank"
								rel="noopener noreferrer"
								className="block w-full h-full p-2"
							>
								{ c.partnerId }
							</Link>
						</ReportTableTd>
						<ReportTableTd isEven={ isEven } align="start" className="font-semibold text-foreground">
							{ c.partnerName }
						</ReportTableTd>
						<ReportTableTd isEven={ isEven } className="font-mono text-muted-foreground text-xs">
							{ c.partnerMobile || c.partnerPhone || "-" }
						</ReportTableTd>
						<ReportTableTd isEven={ isEven } className="font-bold">
							{ c.openInvoicesCount }
						</ReportTableTd>
						<ReportTableTd
							isEven={ isEven }
							className={ c.current > 0 ? "text-emerald-600! font-semibold" : "text-muted-foreground" }
						>
							{ c.current > 0 ? formatNumber(c.current) : "-" }
						</ReportTableTd>
						<ReportTableTd
							isEven={ isEven }
							className={ c.days1To30 > 0 ? "text-blue-600! font-semibold" : "text-muted-foreground" }
						>
							{ c.days1To30 > 0 ? formatNumber(c.days1To30) : "-" }
						</ReportTableTd>
						<ReportTableTd
							isEven={ isEven }
							className={ c.days31To60 > 0 ? "text-amber-600! font-semibold" : "text-muted-foreground" }
						>
							{ c.days31To60 > 0 ? formatNumber(c.days31To60) : "-" }
						</ReportTableTd>
						<ReportTableTd
							isEven={ isEven }
							className={ c.days61To90 > 0 ? "text-orange-600! font-semibold" : "text-muted-foreground" }
						>
							{ c.days61To90 > 0 ? formatNumber(c.days61To90) : "-" }
						</ReportTableTd>
						<ReportTableTd
							isEven={ isEven }
							className={ c.days90Plus > 0 ? "text-rose-600! font-bold" : "text-muted-foreground" }
						>
							{ c.days90Plus > 0 ? formatNumber(c.days90Plus) : "-" }
						</ReportTableTd>
						<ReportTableTd isEven={ isEven } className="font-bold font-mono text-foreground">
							{ formatNumber(c.totalOutstanding) }
						</ReportTableTd>
					</tr>
				);
			}) }
			</tbody>
		</table>
	);
}

function DetailedInvoicesTable({data}: { data: NonNullable<typeof Cubits.receivablesAgingReport.result.value> })
{
	const rows = data.invoices ?? [];

	return (
		<table className="w-full mt-4 border-collapse rounded-lg overflow-hidden">
			<thead>
			<tr>
				<ReportTableTh ar="الرقم" en="No."/>
				<ReportTableTh ar="رقم الفاتورة" en="Invoice ID"/>
				<ReportTableTh ar="العميل" en="Customer" align="start"/>
				<ReportTableTh ar="تاريخ الإصدار" en="Issue Date"/>
				<ReportTableTh ar="تاريخ الاستحقاق" en="Due Date"/>
				<ReportTableTh ar="التأخير (أيام)" en="Overdue"/>
				<ReportTableTh ar="إجمالي الفاتورة" en="Full Amount"/>
				<ReportTableTh ar="المدفوع" en="Paid"/>
				<ReportTableTh ar="المرتجع" en="Credited"/>
				<ReportTableTh ar="المتبقي (المستحق)" en="Remaining"/>
				<ReportTableTh ar="فترة التقادم" en="Aging Bucket"/>
			</tr>
			</thead>
			<tbody>
			{ rows.map((inv, idx) =>
			{
				const isEven = idx % 2 === 0;
				const badge = getReceivablesAgingBucketBadge(inv.bucket);
				return (
					<tr key={ inv.invoiceId }>
						<ReportTableTd isEven={ isEven }>
							{ idx + 1 + ((data.pageNumber - 1) * data.rowsPerPage) }
						</ReportTableTd>
						<ReportTableTd isEven={ isEven } className={ linkClassName }>
							<Link
								to={ `/sales/${ inv.invoiceId }` }
								target="_blank"
								rel="noopener noreferrer"
								className="block w-full h-full p-2 font-mono font-bold"
							>
								#{ inv.invoiceId }
							</Link>
						</ReportTableTd>
						<ReportTableTd isEven={ isEven } align="start" className="font-medium text-foreground">
							{ inv.partnerName }
						</ReportTableTd>
						<ReportTableTd isEven={ isEven } className="font-mono text-xs text-muted-foreground">
							{ inv.issueDate }
						</ReportTableTd>
						<ReportTableTd isEven={ isEven } className="font-mono text-xs">
							{ inv.dueDate || "-" }
						</ReportTableTd>
						<ReportTableTd isEven={ isEven } className="font-bold">
							{ inv.overdueDays > 0 ? (
								<span className="text-destructive font-mono">{ inv.overdueDays } يوم</span>
							) : (
								<span className="text-emerald-600 text-xs">غير متأخر</span>
							) }
						</ReportTableTd>
						<ReportTableTd isEven={ isEven } className="font-mono">
							{ formatNumber(inv.fullAmount) }
						</ReportTableTd>
						<ReportTableTd isEven={ isEven } className="font-mono text-emerald-600">
							{ formatNumber(inv.paidAmount) }
						</ReportTableTd>
						<ReportTableTd isEven={ isEven } className="font-mono text-muted-foreground">
							{ inv.creditedAmount > 0 ? formatNumber(inv.creditedAmount) : "-" }
						</ReportTableTd>
						<ReportTableTd isEven={ isEven } className="font-bold font-mono text-destructive">
							{ formatNumber(inv.remainingAmount) }
						</ReportTableTd>
						<ReportTableTd isEven={ isEven }>
							<span
								className={ `inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border ${ badge.className }` }>
								{ badge.label }
							</span>
						</ReportTableTd>
					</tr>
				);
			}) }
			</tbody>
		</table>
	);
}