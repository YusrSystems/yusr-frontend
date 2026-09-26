import { type UserDto } from "#/entities";
import { apiClient, type ApiResponse, createSimpleListResource, type ISimpleListResource } from "#/api";


export interface UpdateUserPasswordRequest
{
	newPassword: string;
}

export interface IUsersApi extends ISimpleListResource<UserDto>
{
	updatePassword: (id: number, request: UpdateUserPasswordRequest) => Promise<ApiResponse<boolean>>;
}

const baseResource = createSimpleListResource<UserDto>("Users");

export const usersApi: IUsersApi = {
	...baseResource,

	updatePassword: (id: number, request: UpdateUserPasswordRequest) =>
		apiClient.put<boolean>(`/api/Users/${ id }/Password`, request, {
			successMessage: "تم تحديث كلمة المرور بنجاح"
		})
};