import { BaseApiService, type RequestResult, YusrApiHelper } from "yusr-ui";
import type { BarcodeResult, ItemDto } from "../data/item";


export default class ItemsApiService extends BaseApiService<ItemDto>
{
	constructor()
	{
		super("Items");
	}

	async GetByBarcode(
		barcode: string,
		storeId: number
	): Promise<RequestResult<BarcodeResult>>
	{
		return await YusrApiHelper.Get(`/api/${ this.routeName }/GetByBarcode/${ barcode }/${ storeId }`);
	}
}
