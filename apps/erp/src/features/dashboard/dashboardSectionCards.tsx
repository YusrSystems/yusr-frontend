import { Activity } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CurrencyIcon } from "yusr-ui";
import type DashboardDataOld from "../../core/data/dashboardDataOld.ts";

type DashboardSectionCardsProps = { data: DashboardDataOld; };

const sumArray = (arr?: number[]) => arr?.reduce((a, b) => a + b, 0) ?? 0;

const formatNumber = (num: number) => new Intl.NumberFormat("en-US").format(num);

const MiniBarChart = ({ data, colorClass }: { data?: number[]; colorClass: string; }) =>
{
  const { t } = useTranslation("erpCommon");

  if (!data || data.length === 0)
  {
    return (
      <div className="h-10 mt-4 flex items-end">
        <div className="w-full h-1 bg-muted rounded-full" />
      </div>
    );
  }

  const max = Math.max(...data, 1);

  return (
    <div className="flex items-end justify-between gap-1 h-10 mt-4">
      { data.map((value, index) => (
        <div
          key={ index }
          className={ `w-full rounded-t-sm transition-all duration-500 hover:opacity-100 ${colorClass}` }
          style={ {
            height: `${Math.max((value / max) * 100, 10)}%`,
            opacity: value === 0 ? 0.2 : 0.7
          } }
          title={ t("dashborad.valueTitle", { value: formatNumber(value) }) }
        />
      )) }
    </div>
  );
};

export function DashboardSectionCards({ data }: DashboardSectionCardsProps)
{
  const { t } = useTranslation("erpCommon");

  const cards = useMemo(() => [{
    id: "sales",
    title: t("dashborad.weekSales"),
    dataArray: data.weeklySales,
    total: sumArray(data.weeklySales),
    color: "bg-emerald-500",
    textColor: "text-emerald-600 dark:text-emerald-400"
  }, {
    id: "purchases",
    title: t("dashborad.weekPurchases"),
    dataArray: data.weeklyPurchases,
    total: sumArray(data.weeklyPurchases),
    color: "bg-rose-500",
    textColor: "text-rose-600 dark:text-rose-400"
  }, {
    id: "receipts",
    title: t("dashborad.weekReceipts"),
    dataArray: data.weeklyReceipts,
    total: sumArray(data.weeklyReceipts),
    color: "bg-blue-500",
    textColor: "text-blue-600 dark:text-blue-400"
  }, {
    id: "payments",
    title: t("dashborad.weekPayments"),
    dataArray: data.weeklyPayments,
    total: sumArray(data.weeklyPayments),
    color: "bg-amber-500",
    textColor: "text-amber-600 dark:text-amber-400"
  }], [data, t]);

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 sm:grid-cols-2 xl:grid-cols-4">
      { cards.map((card) => (
        <Card
          key={ card.id }
          className="@container group relative overflow-hidden border-border/40 shadow-sm transition-all hover:shadow-md hover:border-border/80"
        >
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription className="font-medium text-muted-foreground">
                { card.title }
              </CardDescription>
              <Activity className={ `h-4 w-4 opacity-50 ${card.textColor}` } />
            </div>

            <CardTitle className="mt-2 flex items-center gap-1.5 text-3xl font-bold tracking-tight tabular-nums @[250px]:text-4xl">
              { formatNumber(card.total) }
              <CurrencyIcon className="w-8 h-8 shrink-0" />
            </CardTitle>
          </CardHeader>

          <CardContent className="pt-0">
            <MiniBarChart data={ card.dataArray } colorClass={ card.color } />
          </CardContent>
        </Card>
      )) }
    </div>
  );
}
