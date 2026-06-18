import type Item from "@/core/data/item";
import type ItemTransfer from "@/core/data/itemTransfer";
import { ItemTransfersItem } from "@/core/data/itemTransfer";
import type { ItemUnitPricingMethod } from "@/core/data/itemUnitPricingMethod";
import { useSignals } from "@preact/signals-react/runtime";
import { AlertCircle, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ChangeableEntityMode, NumberField, SelectField } from "yusr-ui";
import StoreItemSelector from "../items/storeItemSelector";


export default function ItemTransferTable({entity}: { entity: ItemTransfer; })
{
	useSignals();
	const {t} = useTranslation("stocking");

	const getAvailableQuantity = (row: ItemTransfersItem): number =>
	{
		const iupm = row.itemUnitPricingMethods.value.find((method) =>
			method.id.value === row.itemUnitPricingMethodId.value
		);
		if (!iupm || iupm.quantityMultiplier.value === 0)
		{
			return 0;
		}
		return row.maxQuantity.value - (row.quantity.value || 0) * iupm.quantityMultiplier.value;
	};

	const addItem = (storeItem: Item, selectedIupm: ItemUnitPricingMethod | undefined) =>
	{
		const defaultMethod = selectedIupm || storeItem.itemUnitPricingMethods.value[0];
		const methodId = defaultMethod?.id.value || 0;

		const existingItem = entity.itemTransfersItems.value.find(
			(i) =>
				Number(i.itemId.value) === Number(storeItem.id.value)
				&& Number(i.itemUnitPricingMethodId.value) === Number(methodId)
		);

		if (existingItem)
		{
			existingItem.quantity.value += 1;
		}
		else
		{
			const newItem = ItemTransfersItem.create({
				id: Date.now() + Math.floor(Math.random() * 1000),
				itemId: storeItem.id.value,
				itemName: storeItem.name.value,
				itemUnitPricingMethods: storeItem.itemUnitPricingMethods.value.map((m) => m.toJson()) || [],
				itemUnitPricingMethodId: methodId,
				quantity: storeItem.storeQuantity.value >= 1 ? 1 : 0,
				maxQuantity: storeItem.storeQuantity.value
			});
			entity.itemTransfersItems.value = [...entity.itemTransfersItems.value, newItem];
		}
	};

	const removeItem = (id: number) =>
	{
		entity.itemTransfersItems.value = entity.itemTransfersItems?.value.filter((i) => i.id.value !== id) || [];
	};

	if (!entity.fromStoreId.value)
	{
		return;
	}

	return (
		<div>
			<div className="sticky top-0 z-10 pt-4 pb-2 bg-background">
				{ entity.mode.value === ChangeableEntityMode.Create && (
					<StoreItemSelector
						storeId={ entity.fromStoreId }
						onSelect={ addItem }
					/>
				) }
			</div>

			{ entity.itemTransfersItems.value.length === 0
				? (
					<div
						className="flex flex-col items-center justify-center p-10 text-center text-muted-foreground border border-dashed border-border rounded-lg bg-background/50">
						<p>{ t("itemTransfers.noItems") }</p>
						<p className="text-xs mt-1">{ t("itemTransfers.noItemsHint") }</p>
						{ entity.getError("itemTransfersItems").value && (
							<div
								className="flex items-center gap-1 text-red-500 mt-3 text-sm font-medium bg-red-500/10 px-3 py-1.5 rounded-md">
								<AlertCircle className="h-4 w-4"/>
								{ entity.getError("itemTransfersItems").value }
							</div>
						) }
					</div>
				)
				: (
					<div className="w-full overflow-x-auto border border-border rounded-lg shadow-sm bg-background">
						<table className="w-full text-sm text-right">
							<thead className="bg-muted/40 border-b border-border">
							<tr>
								<th className="p-4 font-semibold w-10 text-center text-muted-foreground">
									{ t("itemTransfers.number") }
								</th>
								<th className="p-4 font-semibold text-start w-40">{ t("itemTransfers.itemName") }</th>
								<th className="p-4 font-semibold text-start w-40">{ t("itemTransfers.pricingMethodAndUnit") }</th>
								<th className="p-4 font-semibold text-start w-40">{ t("itemTransfers.quantity") }</th>
								<th className="p-4 font-semibold w-16 text-center"></th>
							</tr>
							</thead>
							<tbody>
							{ entity.itemTransfersItems.value.map((row, index) => (
								<tr
									key={ row.id.value }
									className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
								>
									<td className="p-4 text-center font-bold text-muted-foreground">{ index + 1 }</td>

									<td className="p-4 text-start">
										<div className="font-semibold text-foreground">{ row.itemName.value }</div>
										{ row.itemUnitPricingMethodId.value && entity.mode.value === ChangeableEntityMode.Create && (
											<div className="text-sm font-semibold text-destructive mt-1">
												{ t("itemTransfers.available") }: { getAvailableQuantity(row) }
											</div>
										) }
									</td>

									<td className="py-4 px-2 text-center align-top">
										<SelectField
											value={ row.itemUnitPricingMethodId }
											options={ row.itemUnitPricingMethods.value?.map((m) => ({
												label: m.itemUnitPricingMethodName.value,
												value: m.id.value
											})) || [] }
											placeholder={ t("itemTransfers.selectPricingMethod") }
											disabled={ entity.mode.value === ChangeableEntityMode.Update }
										/>
									</td>

									<td className="py-4 px-2 text-center align-top">
										<NumberField
											min={ 0 }
											max={ Math.max(0, row.maxQuantity.value) }
											value={ row.quantity }
											disabled={ entity.mode.value === ChangeableEntityMode.Update }
										/>
									</td>

									<td className="p-4 text-center align-top pt-5">
										{ entity.mode.value === ChangeableEntityMode.Create && (
											<button
												type="button"
												onClick={ () => removeItem(row.id.value) }
												className="p-2 text-red-500 hover:text-red-700 hover:bg-red-500/10 rounded-md transition-colors"
												aria-label={ t("itemTransfers.deleteItem") }
											>
												<Trash2 className="h-5 w-5"/>
											</button>
										) }
									</td>
								</tr>
							)) }
							</tbody>
						</table>
					</div>
				) }
		</div>
	);
}
