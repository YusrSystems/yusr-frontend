import { ArrowDownRight, ArrowUpRight, ShoppingCart, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "yusr-ui";
import type { DashboardData } from "@/core/data/dashboardData.ts";
import ErpCurrencyIcon from "@/core/components/erpCurrencyIcon.tsx";


type DashboardSectionCardsProps = { data: DashboardData; };

const formatNumber = (num: number) => new Intl.NumberFormat("en-US", {maximumFractionDigits: 2}).format(num);

const MiniSparkline = ({data, colorClass}: { data: number[]; colorClass: string }) =>
{
	const max = Math.max(...data, 1);
	return (
		<div className="flex items-end justify-between gap-1 h-8 mt-3">
			{ data.map((value, index) => (
				<div
					key={ index }
					className={ `w-full rounded-t-xs transition-all duration-300 ${ colorClass }` }
					style={ {
						height: `${ Math.max((value / max) * 100, 15) }%`,
						opacity: value === 0 ? 0.2 : 0.8
					} }
				/>
			)) }
		</div>
	);
};

export function DashboardSectionCards({data}: DashboardSectionCardsProps)
{
	const summary = data.thisMonth.value;
	const weekly = data.weeklyChart.value;

	const isCashFlowPositive = summary.netCashFlow >= 0;

	const cards = [
		{
			id: "sales",
			title: "صافي المبيعات",
			value: summary.netSales,
			icon: <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400"/>,
			barColor: "bg-emerald-500",
			sparklineData: weekly.map(w => w.netSales),
			badge: `هامش ${ summary.marginPercentage }%`,
			badgeClass: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
		},
		{
			id: "purchases",
			title: "صافي المشتريات",
			value: summary.netPurchases,
			icon: <ShoppingCart className="h-4 w-4 text-rose-600 dark:text-rose-400"/>,
			barColor: "bg-rose-500",
			sparklineData: weekly.map(w => w.netPurchases),
			badge: "المشتريات والخدمات",
			badgeClass: "bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300"
		},
		{
			id: "receipts",
			title: "المقبوضات النقدية",
			value: summary.receipts,
			icon: <ArrowDownRight className="h-4 w-4 text-blue-600 dark:text-blue-400"/>,
			barColor: "bg-blue-500",
			sparklineData: weekly.map(w => w.receipts),
			badge: "تحصيلات الصندوق والبنك",
			badgeClass: "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300"
		},
		{
			id: "payments",
			title: "المدفوعات النقدية",
			value: summary.payments,
			icon: <ArrowUpRight className="h-4 w-4 text-amber-600 dark:text-amber-400"/>,
			barColor: "bg-amber-500",
			sparklineData: weekly.map(w => w.payments),
			badge: isCashFlowPositive ? "+ صافي سيولة موجب" : "- عجز سيولة شهري",
			badgeClass: isCashFlowPositive
				? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
				: "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300"
		}
	];

	return (
		<div className="grid grid-cols-1 gap-4 px-4 lg:px-6 sm:grid-cols-2 xl:grid-cols-4">
			{ cards.map((card) => (
				<Card
					key={ card.id }
					className="group relative overflow-hidden border-border/50 shadow-sm transition-all hover:shadow-md hover:border-border"
				>
					<CardHeader className="pb-2">
						<div className="flex items-center justify-between">
							<CardDescription className="font-semibold text-foreground/80 text-sm">
								{ card.title }
							</CardDescription>
							<div className="p-2 rounded-xl bg-muted/60 transition-transform group-hover:scale-110">
								{ card.icon }
							</div>
						</div>
						<CardTitle
							className="mt-2 flex items-center gap-1.5 text-2xl lg:text-3xl font-bold tracking-tight tabular-nums">
							{ formatNumber(card.value) }
							<ErpCurrencyIcon className="w-6 h-6 shrink-0 opacity-80"/>
						</CardTitle>
					</CardHeader>
					<CardContent className="pt-0 pb-3">
						<MiniSparkline data={ card.sparklineData } colorClass={ card.barColor }/>
						<div className="flex items-center justify-between text-xs text-muted-foreground mt-3">
							<span className={ `px-2 py-0.5 rounded font-medium text-[11px] ${ card.badgeClass }` }>
								{ card.badge }
							</span>
							<span className="font-medium text-muted-foreground/80">هذا الشهر</span>
						</div>
					</CardContent>
				</Card>
			)) }
		</div>
	);
}