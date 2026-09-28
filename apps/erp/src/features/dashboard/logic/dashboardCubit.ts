import { Cubit } from "yusr-ui";
import {
	DashboardErrorState,
	DashboardLoadedState,
	DashboardLoadingState,
	DashboardState
} from "@/features/dashboard/logic/dashboardState.ts";
import { DashboardData } from "@/core/data/dashboardData.ts";
import { dashboardApi } from "../dashboard.api";


export default class DashboardCubit extends Cubit<DashboardState>
{
	public data?: DashboardData;

	constructor()
	{
		super(new DashboardLoadingState());
	}

	public async init()
	{
		this.emit(new DashboardLoadingState());
		const result = await dashboardApi.get();

		if (result.ok && result.data)
		{
			this.data = new DashboardData(result.data);
			this.emit(new DashboardLoadedState());
			return;
		}

		this.emit(new DashboardErrorState());
	}
}