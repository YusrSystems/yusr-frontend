import type { BarcodeResult, ItemDto } from "@/core/data/item";
import { Services } from "@/core/services/services";
import { PageCubit } from "yusr-ui";


export class ItemsCubit extends PageCubit<ItemDto>
{
	constructor()
	{
		super(Services.itemsApi);
	}

	public filterByStoreAndDate(storeId?: number | null, targetDate?: string | null): void
	{
		const query: Record<string, string | number | boolean> = {};

		if (storeId != null)
		{
			query["storeId"] = storeId;
		}
		if (targetDate != null)
		{
			query["targetDate"] = targetDate;
		}

		this.queryParams.value = {...this.queryParams.value, ...query};
		void this.filter(1, undefined, undefined, undefined, {});
	}

	public initForStoreAndDate(
		types?: number[],
		storeId?: number,
		targetDate?: string,
		onlyInStore: boolean = true,
		rowsPerPage = 100
	): void
	{
		const query: Record<string, string | number | boolean> = {};

		if (storeId != undefined)
		{
			query["storeId"] = storeId;
		}
		if (targetDate != undefined)
		{
			query["targetDate"] = targetDate;
		}
		if (onlyInStore != undefined)
		{
			query["onlyInStore"] = onlyInStore;
		}

		void this.filter(1, rowsPerPage, undefined, types, query);
	}

	async getByBarcode(barcode: string, storeId: number): Promise<BarcodeResult | undefined>
	{
		const res = await Services.itemsApi.GetByBarcode(barcode, storeId);
		if (res.status === 200 && res.data)
		{
			return res.data;
		}
		return undefined;
	}

}
