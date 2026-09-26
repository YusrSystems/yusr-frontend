import { type BarcodeResult, ItemDto } from "@/core/data/item";
import { apiClient, createCrudResource } from "#/api";


export const itemsApi = {
	...createCrudResource<ItemDto>("Items"),
	getByBarcode: (barcode: string, storeId: number) =>
		apiClient.get<BarcodeResult>(`/api/Items/GetByBarcode/${ encodeURIComponent(barcode) }/${ storeId }`, {
			silent: true
		})
};