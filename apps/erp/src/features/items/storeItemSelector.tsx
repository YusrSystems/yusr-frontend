import ItemsSearchableSelect from "@/core/components/searchableSelect/itemsSearchableSelect";
import { ItemDto } from "@/core/data/item";
import { ItemUnitPricingMethodDto } from "@/core/data/itemUnitPricingMethod";
import { Cubits } from "@/core/services/cubits";
import { type Signal, signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import { ScanBarcode, ShoppingCart } from "lucide-react";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";


interface StoreItemSelectorProps
{
	storeId: Signal<number | undefined>;
	onSelect?: (item: ItemDto, selectedIupm?: ItemUnitPricingMethodDto) => void;
}

export default function StoreItemSelector({storeId, onSelect}: StoreItemSelectorProps)
{
	useSignals();
	const {t} = useTranslation("erpCommon");
	const barcode = useMemo(() => signal(""), []);
	const barcodeLoading = useMemo(() => signal(false), []);
	const itemId = useMemo(() => signal<number | undefined>(undefined), []);

	const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) =>
	{
		if (e.key === "Enter" && barcode.value && storeId?.value)
		{
			barcodeLoading.value = true;
			const res = await Cubits.items.getByBarcode(barcode.value, storeId.value);
			if (res)
			{
				onSelect?.(res.item, res.selectedIupm);
			}
			barcodeLoading.value = false;
			barcode.value = "";
		}
	};

	return (
		<div
			className="flex items-center justify-start gap-6 p-4 rounded-lg border border-border bg-muted/10 shadow-sm">
			<div className="flex items-center gap-2 font-bold text-lg text-foreground">
				<ShoppingCart className="h-5 w-5"/>
				<span>{ t("storeItemSelector.addItems") }</span>
			</div>

			<div className="relative w-64">
				<input
					type="text"
					placeholder={ t("storeItemSelector.scanBarcode") }
					value={ barcode.value }
					onChange={ (e) => barcode.value = e.target.value }
					onKeyDown={ handleKeyDown }
					disabled={ barcodeLoading.value }
					className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-10"
				/>
				<ScanBarcode className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
			</div>

			<div className="w-80">
				<ItemsSearchableSelect
					id={ itemId }
					onSelect={ (item) =>
					{
						if (item)
						{
							onSelect?.(item);
						}
					} }
				/>
			</div>
		</div>
	);
}
