import type { BarcodeResult, ItemDto } from "@/core/data/item";
import { Services } from "@/core/services/services";
import { PageCubit } from "yusr-ui";


export class ItemsCubit extends PageCubit<ItemDto>
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
			return res.data;
		}

		return undefined;
	}

}
