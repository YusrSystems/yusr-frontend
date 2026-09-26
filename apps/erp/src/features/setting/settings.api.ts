import type { EInvoicingEnvironmentType, SettingDto, SharingSetting } from "@/core/data/setting";
import { apiClient } from "#/api";


export const settingsApi = {
	get: () => apiClient.get<SettingDto>("/api/Settings"),
	getForSharing: (registrationKey: string) =>
		apiClient.get<SharingSetting>(`/api/Settings/Share/${ registrationKey }`),
	update: (dto: SettingDto) =>
		apiClient.put<SettingDto>("/api/Settings", dto, {
			successMessage: "تم حفظ الإعدادات بنجاح"
		})
};

export const eInvoicingApi = {
	link: (otp: string, environment: EInvoicingEnvironmentType) =>
		apiClient.get<SettingDto>(`/api/EInvoicing/LinkEInvoicing/${ otp }/${ environment }`, {
			successMessage: "تم ربط الفوترة الإلكترونية بنجاح"
		})
};