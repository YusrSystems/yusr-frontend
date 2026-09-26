import { apiClient, type ApiResponse, type RequestOptions } from "./apiClient";
import type { FilterGroupDto } from "yusr-ui";


export interface ICrudResource<TDto extends { id: number }>
{
	get: (id: number, options?: RequestOptions) => Promise<ApiResponse<TDto>>;
	filter: (
		pageNumber: number,
		rowsPerPage: number,
		searchText?: string,
		types?: number[],
		queryParams?: Record<string, string | number | boolean>,
		groups?: FilterGroupDto[]
	) => Promise<{ data: TDto[]; count: number }>;
	add: (dto: TDto, options?: RequestOptions) => Promise<ApiResponse<TDto>>;
	update: (dto: TDto, options?: RequestOptions) => Promise<ApiResponse<TDto>>;
	delete: (id: number, options?: RequestOptions) => Promise<ApiResponse<boolean>>;
	abortFilter: () => void;
}

export function createCrudResource<TDto extends { id: number }>(endpoint: string): ICrudResource<TDto>
{
	let activeFilterController: AbortController | null = null;

	return {
		get: (id: number, options?: RequestOptions) =>
			apiClient.get<TDto>(`/api/${ endpoint }/${ id }`, options),

		filter: async (
			pageNumber: number,
			rowsPerPage: number,
			searchText?: string,
			types?: number[],
			queryParams?: Record<string, string | number | boolean>,
			groups?: FilterGroupDto[]
		) =>
		{
			activeFilterController?.abort();
			activeFilterController = new AbortController();

			const params = new URLSearchParams();
			params.set("pageNumber", pageNumber.toString());
			params.set("rowsPerPage", rowsPerPage.toString());
			if (searchText) params.set("searchText", searchText);
			if (queryParams)
			{
				Object.entries(queryParams).forEach(([k, v]) => params.set(k, String(v)));
			}

			const body = {types, groups: groups ?? []};

			try
			{
				const res = await apiClient.post<{ data?: TDto[]; count: number }>(
					`/api/${ endpoint }?${ params.toString() }`,
					body,
					{signal: activeFilterController.signal, silent: true}
				);

				return {
					data: res.data?.data ?? [],
					count: res.data?.count ?? 0
				};
			}
			catch (e: any)
			{
				if (e.name === "AbortError")
				{
					return {data: [], count: 0};
				}
				throw e;
			}
		},

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
			}),

		abortFilter: () =>
		{
			activeFilterController?.abort();
			activeFilterController = null;
		}
	};
}