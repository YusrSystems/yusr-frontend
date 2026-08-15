import * as React from "react";
import { useTranslation } from "react-i18next";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	type ChartConfig,
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	ToggleGroup,
	ToggleGroupItem
} from "yusr-ui";
import type { DashboardData } from "@/core/data/dashboardData.ts";
import ErpCurrencyIcon from "@/core/components/erpCurrencyIcon.tsx";


type ChartAreaInteractiveProps = { data: DashboardData; };

export function DashboardChartAreaInteractive({data}: ChartAreaInteractiveProps)
{
	const {i18n} = useTranslation("erpCommon");
	const isRtl = i18n.dir() === "rtl";

	const [timeRange, setTimeRange] = React.useState<"weekly" | "monthly" | "yearly">("yearly");
	const [metricType, setMetricType] = React.useState<"trading" | "cashflow">("trading");

	const chartConfig = {
		primary: {
			label: metricType === "trading" ? "صافي المبيعات" : "المقبوضات (وارد)",
			color: metricType === "trading" ? "#10b981" : "#3b82f6"
		},
		secondary: {
			label: metricType === "trading" ? "صافي المشتريات" : "المدفوعات (صادر)",
			color: metricType === "trading" ? "#ef4444" : "#f59e0b"
		}
	} satisfies ChartConfig;

	const chartData = React.useMemo(() =>
	{
		let source = data.yearlyChart.value;
		if (timeRange === "weekly") source = data.weeklyChart.value;
		if (timeRange === "monthly") source = data.monthlyChart.value;

		return source.map(item => ({
			label: item.label,
			primary: metricType === "trading" ? item.netSales : item.receipts,
			secondary: metricType === "trading" ? item.netPurchases : item.payments
		}));
	}, [data.weeklyChart.value, data.monthlyChart.value, data.yearlyChart.value, timeRange, metricType]);

	const primaryColor = chartConfig.primary.color;
	const secondaryColor = chartConfig.secondary.color;

	return (
		<Card className="h-full shadow-sm border-border/50 flex flex-col justify-between">
			<CardHeader
				className="flex flex-col items-start gap-3 space-y-0 sm:flex-row sm:items-center sm:justify-between pb-2">
				<div>
					<CardTitle className="text-base font-bold">
						{ metricType === "trading" ? "حركة المبيعات والمشتريات" : "حركة التدفق النقدي" }
					</CardTitle>
					<CardDescription className="text-xs mt-0.5">
						{ metricType === "trading"
							? "مقارنة دقيقة بين صافي المبيعات وصافي المشتريات"
							: "مقارنة بين المقبوضات النقدية والمدفوعات" }
					</CardDescription>
				</div>
				<div className="flex flex-wrap items-center gap-2">
					<Select
						value={ metricType }
						onValueChange={ (val) => setMetricType(val as "trading" | "cashflow") }
					>
						<SelectTrigger className="w-36 h-8 text-xs rounded-lg" size="sm">
							<SelectValue/>
						</SelectTrigger>
						<SelectContent className="rounded-xl">
							<SelectItem value="trading">المبيعات والمشتريات</SelectItem>
							<SelectItem value="cashflow">التدفق النقدي</SelectItem>
						</SelectContent>
					</Select>

					<ToggleGroup
						type="single"
						value={ timeRange }
						onValueChange={ (val) => val && setTimeRange(val as "weekly" | "monthly" | "yearly") }
						variant="outline"
						className="h-8"
					>
						<ToggleGroupItem value="yearly" className="px-2.5 text-xs">سنوي</ToggleGroupItem>
						<ToggleGroupItem value="monthly" className="px-2.5 text-xs">شهري</ToggleGroupItem>
						<ToggleGroupItem value="weekly" className="px-2.5 text-xs">أسبوعي</ToggleGroupItem>
					</ToggleGroup>
				</div>
			</CardHeader>
			<CardContent className="px-2 pt-0 sm:px-4 sm:pt-2">
				<ChartContainer config={ chartConfig } className="aspect-auto h-[260px] sm:h-[290px] w-full">
					<ResponsiveContainer width="100%" height="100%">
						<AreaChart data={ chartData } margin={ {top: 10, right: 10, left: -15, bottom: 0} }>
							<defs>
								<linearGradient id="fillPrimary" x1="0" y1="0" x2="0" y2="1">
									<stop offset="5%" stopColor={ primaryColor } stopOpacity={ 0.35 }/>
									<stop offset="95%" stopColor={ primaryColor } stopOpacity={ 0.0 }/>
								</linearGradient>
								<linearGradient id="fillSecondary" x1="0" y1="0" x2="0" y2="1">
									<stop offset="5%" stopColor={ secondaryColor } stopOpacity={ 0.35 }/>
									<stop offset="95%" stopColor={ secondaryColor } stopOpacity={ 0.0 }/>
								</linearGradient>
							</defs>
							<CartesianGrid strokeDasharray="3 3" vertical={ false } stroke="hsl(var(--border) / 0.6)"/>
							<XAxis
								dataKey="label"
								reversed={ isRtl }
								tickLine={ false }
								axisLine={ false }
								tickMargin={ 8 }
								interval={ timeRange === "monthly" ? 3 : 0 }
								tick={ {fontSize: 11, fill: "hsl(var(--muted-foreground))"} }
							/>
							<YAxis
								tickLine={ false }
								axisLine={ false }
								tickFormatter={ (val) => val >= 1000 ? `${ (val / 1000).toFixed(0) }k` : val }
								tick={ {fontSize: 11, fill: "hsl(var(--muted-foreground))"} }
								width={ 40 }
							/>
							<ChartTooltip
								cursor={ {
									stroke: "hsl(var(--muted-foreground))",
									strokeWidth: 1,
									strokeDasharray: "4 4"
								} }
								content={
									<ChartTooltipContent
										indicator="dot"
										formatter={ (value, name) => (
											<div className="flex items-center justify-between gap-4 w-full">
												<span className="text-muted-foreground text-xs">
													{ name === "primary" ? chartConfig.primary.label : chartConfig.secondary.label }
												</span>
												<span
													className="font-semibold tabular-nums text-xs flex items-center gap-1">
													{ Number(value).toLocaleString("en-US", {
														minimumFractionDigits: 2,
														maximumFractionDigits: 2
													}) }
													<ErpCurrencyIcon className="w-3.5 h-3.5"/>
												</span>
											</div>
										) }
									/>
								}
							/>
							<ChartLegend content={ <ChartLegendContent/> }/>
							<Area
								dataKey="primary"
								name="primary"
								type="natural"
								fill="url(#fillPrimary)"
								stroke={ primaryColor }
								strokeWidth={ 2.5 }
								activeDot={ {r: 4, strokeWidth: 0} }
							/>
							<Area
								dataKey="secondary"
								name="secondary"
								type="natural"
								fill="url(#fillSecondary)"
								stroke={ secondaryColor }
								strokeWidth={ 2.5 }
								activeDot={ {r: 4, strokeWidth: 0} }
							/>
						</AreaChart>
					</ResponsiveContainer>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}