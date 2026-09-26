import { DashboardDataDto } from "@/core/data/dashboardData";
import { apiClient } from "#/api";


export const dashboardApi = {
	get: () => apiClient.get<DashboardDataDto>("/api/Dashboard")
};