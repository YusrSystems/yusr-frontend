import type { BarcodeResult, ItemDto } from "@/core/data/item";
import Item from "@/core/data/item";
import { ItemUnitPricingMethod } from "@/core/data/itemUnitPricingMethod";
import { Services } from "@/core/services/services";
import { PageCubit } from "yusr-ui";


export class ItemsCubit extends PageCubit<Item, ItemDto>
{
	constructor()
	{
		super(Services.itemsApi);
	}

	async getByBarcode(
		barcode: string,
		storeId: number
	): Promise<BarcodeResult | undefined>
	{
		const res = await Services.itemsApi.GetByBarcode(barcode, storeId);
		if (res.status === 200 && res.data)
		{
			return {
				item: Item.create(res.data.item),
				selectedIupm: ItemUnitPricingMethod.create(res.data.selectedIupm)
			};
		}

		return undefined;
	}

}
