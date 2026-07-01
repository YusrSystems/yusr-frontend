import { type TFunction } from "i18next";
import type { Dto } from "../stateManager";
import type { RequestResult } from "../types/requestResult";
import { BaseFilterableApiService } from "./baseFilterableApiService";
import { YusrApiHelper } from "./yusrApiHelper";


export class BaseApiService<TDto extends Dto> extends BaseFilterableApiService<TDto>
{
	private static t: TFunction<"common"> | null = null;

	constructor(routeName: string)
	{
		super(routeName);
	}

	public static init(t: TFunction<"common">)
	{
		this.t = t;
	}

	protected static getT(): TFunction<"common">
	{
		if (!this.t)
		{
			throw new Error("BaseApiService not initialized. Call BaseApiService.init(t) first.");
		}
		return this.t;
	}

	async Get(id: number): Promise<RequestResult<TDto>>
	{
		return await YusrApiHelper.Get<TDto>(`/api/${ this.routeName }/${ id }`);
	}

	async Add(dto: TDto): Promise<RequestResult<TDto>>
	{
		const t = BaseApiService.getT();
		return await YusrApiHelper.Post<TDto>(
			`/api/${ this.routeName }/Add`,
			dto,
			undefined,
			t("api.saveSuccess")
		);
	}

	async Update(dto: TDto): Promise<RequestResult<TDto>>
	{
		const t = BaseApiService.getT();
		return await YusrApiHelper.Put<TDto>(
			`/api/${ this.routeName }/Update`,
			dto,
			undefined,
			t("api.updateSuccess")
		);
	}

	async Delete(id: number)
	{
		const t = BaseApiService.getT();
		return await YusrApiHelper.Delete(
			`/api/${ this.routeName }/${ id }`,
			undefined,
			t("api.deleteSuccess")
		);
	}
}
