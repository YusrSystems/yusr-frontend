import { apiClient, createCrudResource } from "yusr-ui";
import { type PartnerDto } from "@/core/data/partner";


export const partnersApi = {
	...createCrudResource<PartnerDto>("Partners"),

	updateStatus: (id: number, isActive: boolean) =>
		apiClient.put<boolean>(`/api/Partners/${ id }/Status`, {isActive}, {
			successMessage: isActive ? "تم تفعيل الجهة بنجاح" : "تم تعطيل الجهة بنجاح"
		})
};