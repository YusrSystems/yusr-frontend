import { Dto, Entity } from "../stateManager";
import type { ApiFilterResult } from "../types";
import type { FilterResult } from "../types/filterResult";
import { YusrApiHelper } from "./yusrApiHelper";


export abstract class BaseFilterableApiService<TEntity extends Entity<TDto>, TDto extends Dto>
{
	private static _pendingRequests = new Set<AbortController>();
	abstract routeName: string;

	public static abortAll()
	{
		this._pendingRequests.forEach((request: AbortController) => request.abort());
		this._pendingRequests.clear();
	}

	abstract createEntity(dto: TDto): TEntity;

	async Filter(
		pageNumber: number,
		rowsPerPage: number,
		searchText?: string,
		types?: number[],
		queryParams?: Record<string, string | number | boolean>
	): Promise<FilterResult<TEntity, TDto>>
	{
		const params = new URLSearchParams();
		params.set("pageNumber", pageNumber.toString());
		params.set("rowsPerPage", rowsPerPage.toString());
		if (searchText)
		{
			params.set("searchText", searchText);
		}
		if (queryParams)
		{
			Object.entries(queryParams).forEach(([k, v]) => params.set(k, String(v)));
		}

		const controller = new AbortController();
		const {signal} = controller;

		BaseFilterableApiService._pendingRequests.add(controller);
		const rawResult = await YusrApiHelper.Post<ApiFilterResult<TDto>>(
			`/api/${ this.routeName }/Filter?${ params.toString() }`,
			types,
			{signal}
		);
		BaseFilterableApiService._pendingRequests.delete(controller);

		return {
			data: rawResult?.data?.data?.map((dto: TDto) => this.createEntity(dto)) ?? [],
			count: rawResult?.data?.count ?? 0
		};
	}
}
