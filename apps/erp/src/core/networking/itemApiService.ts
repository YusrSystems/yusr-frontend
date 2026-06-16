import {
  type ApiFilterResult,
  BaseApiService,
  FilterByTypeRequest,
  type FilterResult,
  type RequestResult,
  YusrApiHelper
} from "yusr-ui";
import type { BarcodeResultDto, ItemDto } from "../data/item";
import Item from "../data/item";


export default class ItemsApiService extends BaseApiService<Item, ItemDto>
{
	routeName: string = "Items";

	override createEntity(dto: ItemDto): Item
	{
		return new Item(dto);
	}

	// TODO: fix
	override async Filter(
		pageNumber: number,
		rowsPerPage: number,
		searchText?: string,
		types?: number[],
		queryParams?: Record<string, string | number>
	): Promise<FilterResult<Item, ItemDto>>
	{
		const extraQuery = queryParams
			? "&" + new URLSearchParams(
			Object.entries(queryParams).map(([k, v]) => [k, String(v)])
		).toString()
			: "";

		const body = types !== undefined
			? new FilterByTypeRequest({searchText, types})
			: searchText;

		const rawResult = await YusrApiHelper.Post<ApiFilterResult<ItemDto>>(
			`/api/${ this.routeName }/FilterNew?pageNumber=${ pageNumber }&rowsPerPage=${ rowsPerPage }${ extraQuery }`,
			body
		);

		return {
			data: rawResult?.data?.data?.map((dto: ItemDto) => this.createEntity(dto)) ?? [],
			count: rawResult?.data?.count ?? 0
		};
	}

	async GetByBarcode(
		barcode: string,
		storeId: number
	): Promise<RequestResult<BarcodeResultDto>>
	{
		return await YusrApiHelper.Get(`/api/${ this.routeName }/GetByBarcode/${ barcode }/${ storeId }`);
	}
}
