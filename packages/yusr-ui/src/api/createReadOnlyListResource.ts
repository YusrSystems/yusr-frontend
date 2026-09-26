import { apiClient, type ApiResponse, type RequestOptions } from "./apiClient";


export interface IReadOnlyListResource<TDto extends { id: number }>
{
	list: (
		queryParams?: Record<string, string | number | boolean>,
		options?: RequestOptions
	) => Promise<ApiResponse<TDto[]>>;
}

export function createReadOnlyListResource<TDto extends { id: number }>(
	endpoint: string
): IReadOnlyListResource<TDto>
{
	return {
		list: (
			queryParams?: Record<string, string | number | boolean>,
			options?: RequestOptions
		) =>
		{
			const params = new URLSearchParams();
			if (queryParams)
			{
				Object.entries(queryParams).forEach(([k, v]) => params.set(k, String(v)));
			}
			const queryString = params.toString();
			const url = queryString ? `/api/${ endpoint }?${ queryString }` : `/api/${ endpoint }`;

			return apiClient.get<TDto[]>(url, options);
		}
	};
}