import type { BarcodeResult, ItemDto } from "@/core/data/item";
import { PageCubit } from "yusr-ui";
import { itemsApi } from "../items.api";


export class ItemsCubit extends PageCubit<ItemDto>
{
	constructor()
	{
		super(itemsApi);
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
		const res = await itemsApi.getByBarcode(barcode, storeId);
		if (res.ok && res.data)
		{
			return res.data;
		}
		return undefined;
	}
}