import { useEffect } from "react";
import { type Signal } from "@preact/signals-react";
import { ItemType } from "@/core/data/item";
import { Cubits } from "@/core/services/cubits";


export function useStoreItemsSync(
	storeIdSignal: Signal<number | undefined>,
	isDisabled: boolean,
	hasAuth: boolean
)
{
	const currentStoreId = storeIdSignal.value;

	useEffect(() =>
	{
		if (currentStoreId && !isDisabled && hasAuth)
		{
			Cubits.items.init([ItemType.Product, ItemType.Service], {storeId: currentStoreId});
		}
	}, [currentStoreId, isDisabled, hasAuth]);
}