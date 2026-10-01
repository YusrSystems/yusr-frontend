import { apiClient, createCrudResource } from "yusr-ui";
import { type AccountDto } from "@/core/data/account";


export const accountsApi = {
	...createCrudResource<AccountDto>("Accounts"),

	updateStatus: (id: number, isActive: boolean) =>
		apiClient.put<boolean>(`/api/Accounts/${ id }/Status`, {isActive}, {
			successMessage: isActive ? "تم تفعيل الحساب بنجاح" : "تم تعطيل الحساب بنجاح"
		})
};