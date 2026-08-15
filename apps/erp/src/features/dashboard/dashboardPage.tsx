import { useEffect, useMemo } from "react";
import CurrencyBadge from "./currencyBadge";
import { DashboardChartAreaInteractive } from "./dashboardChartAreaInteractive";
import { DashboardSectionCards } from "./dashboardSectionCards";
import { DashboardTaxAndActionsWidget } from "./dashboardTaxAndActionsWidget";
import DashboardSkeleton from "./dashboardSkeleton";
import DashboardCubit from "@/features/dashboard/logic/dashboardCubit.ts";
import { DashboardLoadingState } from "@/features/dashboard/logic/dashboardState.ts";
import { useSignals } from "@preact/signals-react/runtime";
import ReferralCard from "@/features/dashboard/referralCard.tsx";
import { useTranslation } from "react-i18next";
import { APP_NAME } from "../../../appConfig.ts";


export default function DashboardPage()
{
	useSignals();
	const cubit = useMemo(() => new DashboardCubit(), []);

	useEffect(() =>
	{
		void cubit.init();
	}, [cubit]);

	const {t} = useTranslation("erpCommon");

	useEffect(() =>
	{
		document.title = `${ t("sidebar.dashboard") } | ${ APP_NAME }`;
		return () =>
		{
			document.title = APP_NAME;
		};
	}, [t]);

	if (cubit.state.value instanceof DashboardLoadingState)
	{
		return <DashboardSkeleton/>;
	}

	const data = cubit.data;

	return (
		<div className="flex flex-col gap-4 py-3 md:gap-4 md:py-4">
			<CurrencyBadge/>
			<div className="px-4 lg:px-6">
				<ReferralCard/>
			</div>
			<DashboardSectionCards data={ data! }/>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-4 px-4 lg:px-6 items-stretch">
				<div className="lg:col-span-1">
					<DashboardTaxAndActionsWidget data={ data! }/>
				</div>
				<div className="lg:col-span-2">
					<DashboardChartAreaInteractive data={ data! }/>
				</div>
			</div>
		</div>
	);
}