import { apiClient, type ApiResponse } from "#/api";


export const systemApi = {
	getPermissions: (): Promise<ApiResponse<string[]>> =>
		apiClient.get<string[]>("/api/System/Permissions")
};