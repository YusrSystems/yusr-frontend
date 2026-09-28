import { apiClient, type ApiResponse } from "yusr-ui";
import { type DashboardDataDto } from "@/core/data/dashboardData";


export const dashboardApi = {
	get: (): Promise<ApiResponse<DashboardDataDto>> =>
		apiClient.get<DashboardDataDto>("/api/Dashboard")
};