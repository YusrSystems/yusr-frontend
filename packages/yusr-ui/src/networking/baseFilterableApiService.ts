import { Dto } from "../stateManager";
import type { ApiFilterResult } from "../types";
import type { FilterResult } from "../types/filterResult";
import { YusrApiHelper } from "./yusrApiHelper";
import type { FilterGroupDto } from "../filter/filterGroup.ts";


export class BaseFilterableApiService<TDto extends Dto>
{
	private static _pendingRequests = new Set<AbortController>();
	protected routeName: string;

	constructor(routeName: string)
	{
		this.routeName = routeName;
	}

	public static abortAll()
	{
		this._pendingRequests.forEach((request: AbortController) => request.abort());
		this._pendingRequests.clear();
	}

	async Filter(
		pageNumber: number,
		rowsPerPage: number,
		searchText?: string,
		types?: number[],
		queryParams?: Record<string, string | number | boolean>,
		groups?: FilterGroupDto[]
	): Promise<FilterResult<TDto>>
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

		const body = {types, groups: groups ?? []};
		BaseFilterableApiService._pendingRequests.add(controller);

		const rawResult = await YusrApiHelper.Post<ApiFilterResult<TDto>>(
			`/api/${ this.routeName }/Filter?${ params.toString() }`,
			body,
			{signal}
		);
		BaseFilterableApiService._pendingRequests.delete(controller);

		return {
			data: rawResult?.data?.data ?? [],
			count: rawResult?.data?.count ?? 0
		};
	}
}
