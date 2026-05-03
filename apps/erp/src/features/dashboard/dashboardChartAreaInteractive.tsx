import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle, type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, ToggleGroup, ToggleGroupItem } from "yusr-ui";
import CurrencyIcon from "../../../../../packages/yusr-ui/src/components/custom/currency/currencyIcon";
import type DashboardData from "../../core/data/dashboardData";

const chartConfig = {
  sales: { label: "المبيعات", color: "var(--primary)" },
  purchases: { label: "المشتريات", color: "hsl(var(--destructive))" }
} satisfies ChartConfig;

type ChartAreaInteractiveProps = { data: DashboardData; };

export function DashboardChartAreaInteractive({ data }: ChartAreaInteractiveProps)
{
  const [timeRange, setTimeRange] = React.useState<"weekly" | "yearly">("yearly");

  const chartData = React.useMemo(() =>
  {
    if (timeRange === "weekly")
    {
      const days = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
      return days.map((day, index) => ({
        label: day,
        sales: data.weeklySales?.[index] || 0,
        purchases: data.weeklyPurchases?.[index] || 0
      }));
    }
    else
    {
      const months = [
        "يناير",
        "فبراير",
        "مارس",
        "أبريل",
        "مايو",
        "يونيو",
        "يوليو",
        "أغسطس",
        "سبتمبر",
        "أكتوبر",
        "نوفمبر",
        "ديسمبر"
      ];
      return months.map((month, index) => ({
        label: month,
        sales: data.yearlyData?.sales?.[index] || 0,
        purchases: data.yearlyData?.purchases?.[index] || 0
      }));
    }
  }, [data, timeRange]);

  return (
    <Card className="@container/card m-6">
      <CardHeader>
        <CardTitle>المبيعات والمشتريات</CardTitle>
        <CardDescription>مقارنة بين إجمالي المبيعات والمشتريات</CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={ timeRange }
            onValueChange={ (val) => val && setTimeRange(val as "weekly" | "yearly") }
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:px-4! @[767px]/card:flex"
          >
            <ToggleGroupItem value="yearly">سنوي</ToggleGroupItem>
            <ToggleGroupItem value="weekly">أسبوعي</ToggleGroupItem>
          </ToggleGroup>
          <Select value={ timeRange } onValueChange={ (val) => setTimeRange(val as "weekly" | "yearly") }>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="سنوي" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="yearly" className="rounded-lg">سنوي</SelectItem>
              <SelectItem value="weekly" className="rounded-lg">أسبوعي</SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={ chartConfig } className="aspect-auto h-62.5 w-full">
          <AreaChart data={ chartData }>
            <defs>
              <linearGradient id="fillSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-sales)" stopOpacity={ 0.8 } />
                <stop offset="95%" stopColor="var(--color-sales)" stopOpacity={ 0.1 } />
              </linearGradient>
              <linearGradient id="fillPurchases" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-purchases)" stopOpacity={ 0.8 } />
                <stop offset="95%" stopColor="var(--color-purchases)" stopOpacity={ 0.1 } />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={ false } />
            <XAxis
              dataKey="label"
              tickLine={ false }
              axisLine={ false }
              tickMargin={ 8 }
              interval={ 0 }
              tick={ { fontSize: 11 } }
              padding={{ left: 20, right: 20 }}
            />
            <ChartTooltip
              cursor={ false }
              content={ 
                <ChartTooltipContent
                  indicator="dot"
                  formatter={ (value) =>
                    typeof value === "number"
                      ? (
                        <span className="inline-flex items-center gap-1 tabular-nums">
                          { value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }
                          <CurrencyIcon />
                        </span>
                      )
                      : value }
                />
               }
            />
            <Area
              dataKey="sales"
              type="natural"
              fill="url(#fillSales)"
              stroke="var(--color-sales)"
              stackId="a"
            />
            <Area
              dataKey="purchases"
              type="natural"
              fill="url(#fillPurchases)"
              stroke="var(--color-purchases)"
              stackId="b"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
