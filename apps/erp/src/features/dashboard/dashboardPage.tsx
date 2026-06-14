import {useEffect, useMemo} from "react";
import CurrencyBadge from "./currencyBadge";
import { DashboardChartAreaInteractive } from "./dashboardChartAreaInteractive";
import { DashboardSectionCards } from "./dashboardSectionCards";
import DashboardSkeleton from "./dashboardSkeleton";
import DashboardCubit from "@/features/dashboard/logic/dashboardCubit.ts";
import {   DashboardLoadingState} from "@/features/dashboard/logic/dashboardState.ts";
import {useSignals} from "@preact/signals-react/runtime";

export default function DashboardPage()
{
  useSignals();
  const cubit = useMemo(()=> new DashboardCubit(),[])
  useEffect(() => {
          cubit.init()
  }, [cubit.init]);


  if (cubit.state.value instanceof DashboardLoadingState )
  {
    return <DashboardSkeleton />;
  }

  const data = cubit.data;
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <CurrencyBadge />

      <DashboardSectionCards data={ data! } />
      <DashboardChartAreaInteractive data={ data! } />
    </div>
  );
}
