import { apiClient, type ApiResponse } from "yusr-ui";
import { type SettingDto, type SharingSetting } from "@/core/data/setting";


export const settingsApi = {
	get: (): Promise<ApiResponse<SettingDto>> =>
		apiClient.get<SettingDto>("/api/Settings"),

	update: (dto: SettingDto): Promise<ApiResponse<SettingDto>> =>
		apiClient.put<SettingDto>("/api/Settings", dto, {
			successMessage: "تم تحديث الإعدادات بنجاح"
		}),

	getForSharing: (registrationKey: string): Promise<ApiResponse<SharingSetting>> =>
		apiClient.get<SharingSetting>(`/api/Settings/Share/${ registrationKey }`)
};