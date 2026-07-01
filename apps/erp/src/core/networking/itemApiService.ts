import { BaseApiService, type RequestResult, YusrApiHelper } from "yusr-ui";
import type { BarcodeResult, ItemDto } from "../data/item";
import Item from "../data/item";


export default class ItemsApiService extends BaseApiService<Item, ItemDto>
{
	routeName: string = "Items";

	override createEntity(dto: ItemDto): Item
	{
		return new Item(dto);
	}

	async GetByBarcode(
		barcode: string,
		storeId: number
	): Promise<RequestResult<BarcodeResult>>
	{
		return await YusrApiHelper.Get(`/api/${ this.routeName }/GetByBarcode/${ barcode }/${ storeId }`);
	}
}
