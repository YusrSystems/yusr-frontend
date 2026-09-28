import { apiClient, type ApiResponse } from "yusr-ui";
import { type EInvoicingEnvironmentType, type SettingDto } from "@/core/data/setting";


export const eInvoicingApi = {
	link: (otp: string, environment: EInvoicingEnvironmentType): Promise<ApiResponse<SettingDto>> =>
		apiClient.get<SettingDto>(`/api/EInvoicing/LinkEInvoicing/${ otp }/${ environment }`, {
			successMessage: "تم ربط الفوترة الإلكترونية مع هيئة الزكاة والضريبة بنجاح"
		})
};