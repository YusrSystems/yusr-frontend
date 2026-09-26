import { apiClient, type ApiResponse, type RequestOptions } from "./apiClient";


export interface ISimpleListResource<TDto extends { id: number }>
{
	list: (queryParams?: Record<string, string | number | boolean>, options?: RequestOptions) => Promise<ApiResponse<TDto[]>>;
	get: (id: number, options?: RequestOptions) => Promise<ApiResponse<TDto>>;
	add: (dto: TDto, options?: RequestOptions) => Promise<ApiResponse<TDto>>;
	update: (dto: TDto, options?: RequestOptions) => Promise<ApiResponse<TDto>>;
	delete: (id: number, options?: RequestOptions) => Promise<ApiResponse<boolean>>;
}

export function createSimpleListResource<TDto extends { id: number }>(
	endpoint: string
): ISimpleListResource<TDto>
{
	return {
		list: (queryParams?: Record<string, string | number | boolean>, options?: RequestOptions) =>
		{
			const params = new URLSearchParams();
			if (queryParams)
			{
				Object.entries(queryParams).forEach(([k, v]) => params.set(k, String(v)));
			}
			const queryString = params.toString();
			const url = queryString ? `/api/${ endpoint }?${ queryString }` : `/api/${ endpoint }`;

			return apiClient.get<TDto[]>(url, options);
		},

		get: (id: number, options?: RequestOptions) =>
			apiClient.get<TDto>(`/api/${ endpoint }/${ id }`, options),

		add: (dto: TDto, options?: RequestOptions) =>
			apiClient.post<TDto>(`/api/${ endpoint }/Add`, dto, {
				successMessage: "تم حفظ البيانات بنجاح",
				...options
			}),

		update: (dto: TDto, options?: RequestOptions) =>
			apiClient.put<TDto>(`/api/${ endpoint }/Update`, dto, {
				successMessage: "تم تحديث المعلومات بنجاح",
				...options
			}),

		delete: (id: number, options?: RequestOptions) =>
			apiClient.delete<boolean>(`/api/${ endpoint }/${ id }`, {
				successMessage: "تمت إزالة السجل بنجاح",
				...options
			})
	};
}