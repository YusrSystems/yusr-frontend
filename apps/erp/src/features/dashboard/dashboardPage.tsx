import { useEffect, useMemo } from "react";
import CurrencyBadge from "./currencyBadge";
import { DashboardChartAreaInteractive } from "./dashboardChartAreaInteractive";
import { DashboardSectionCards } from "./dashboardSectionCards";
import DashboardSkeleton from "./dashboardSkeleton";
import DashboardCubit from "@/features/dashboard/logic/dashboardCubit.ts";
import { DashboardLoadingState } from "@/features/dashboard/logic/dashboardState.ts";
import { useSignals } from "@preact/signals-react/runtime";
import ReferralCard from "@/features/dashboard/referralCard.tsx";


export default function DashboardPage()
{
	// TODO: we should fix the the months issue, it maybe from backend
	useSignals();
	const cubit = useMemo(() => new DashboardCubit(), []);
	useEffect(() =>
	{
		void cubit.init();
	}, [cubit]);

	if (cubit.state.value instanceof DashboardLoadingState)
	{
		return <DashboardSkeleton/>;
	}

	const data = cubit.data;
	return (
		<div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
			<CurrencyBadge/>

			<div className="px-4 lg:px-6">
				<ReferralCard/>
			</div>

			<DashboardSectionCards data={ data! }/>
			<DashboardChartAreaInteractive data={ data! }/>
		</div>
	);
}
