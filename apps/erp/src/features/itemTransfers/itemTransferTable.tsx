import { ItemDto } from "@/core/data/item";
import type ItemTransfer from "@/core/data/itemTransfer";
import { ItemTransfersItem } from "@/core/data/itemTransfer";
import { ItemUnitPricingMethodDto } from "@/core/data/itemUnitPricingMethod";
import { Cubits } from "@/core/services/cubits";
import { useSignals } from "@preact/signals-react/runtime";
import { AlertCircle, Trash2, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button, ChangeableEntityMode, NumberField, SelectField } from "yusr-ui";
import StoreItemSelector from "../items/storeItemSelector";


export default function ItemTransferTable({entity}: { entity: ItemTransfer; })
{
	useSignals();
	const {t} = useTranslation("stocking");

	const groupedItems = (() =>
	{
		const groups = new Map<number, ItemTransfersItem[]>();
		entity.itemTransfersItems?.value.forEach((item) =>
		{
			if (!groups.has(item.itemId.value))
			{
				groups.set(item.itemId.value, []);
			}
			groups.get(item.itemId.value)!.push(item);
		});
		return Array.from(groups.values());
	})();

	const getAvailableUnits = (itemId: number | undefined, group: ItemTransfersItem[]) =>
	{
		const storeItem = Cubits.items.entities.value.find((si) => si.id === itemId);
		const usedUnitIds = group.map((i) => i.itemUnitPricingMethodId.value);
		return storeItem?.itemUnitPricingMethods?.filter((u) => !usedUnitIds.includes(u.id)) || [];
	};

	const getQuantities = (
		row: ItemTransfersItem,
		group: ItemTransfersItem[]
	): { availableQuantity: number, MaxQuantity: number } =>
	{
		const method = row.itemUnitPricingMethods.value.find(
			m => m.id.value === row.itemUnitPricingMethodId.value
		);

		if (!method)
		{
			return {availableQuantity: 0, MaxQuantity: 0};
		}

		const usedByOthers = group
			.filter(i => i.id.value !== row.id.value)
			.reduce((sum, i) =>
			{
				const m = i.itemUnitPricingMethods.value.find(
					x => x.id.value === i.itemUnitPricingMethodId.value
				);

				return sum + (i.quantity.value || 0) * (m?.quantityMultiplier.value || 0);
			}, 0);

		const currentUsage =
			(row.quantity.value || 0) * method.quantityMultiplier.value;

		return {
			availableQuantity: Math.max(
				0,
				Math.floor(
					(
						row.maxQuantity.value -
						usedByOthers -
						currentUsage
					) / method.quantityMultiplier.value
				)
			),
			MaxQuantity: Math.max(
				0,
				Math.floor(
					(row.maxQuantity.value - usedByOthers) /
					method.quantityMultiplier.value
				)
			)
		};
	};

	const createTransferItem = (storeItem: ItemDto, iupm: ItemUnitPricingMethodDto) =>
	{
		return ItemTransfersItem.create({
			// eslint-disable-next-line react-hooks/purity
			id: Math.floor(Math.random() * -1000000),
			itemId: storeItem.id,
			itemName: storeItem.name,
			itemUnitPricingMethods: storeItem.itemUnitPricingMethods || [],
			itemUnitPricingMethodId: iupm.id,
			itemUnitPricingMethodName: iupm.itemUnitPricingMethodName,
			quantity: storeItem.storeQuantity >= 1 ? 1 : 0,
			maxQuantity: storeItem.storeQuantity
		});
	};

	const addUnitToItem = (itemId: number, unitId: number | undefined) =>
	{
		const storeItem = Cubits.items.entities.value.find((si) => si.id === itemId);
		const unitDetails = storeItem?.itemUnitPricingMethods?.find((u) => u.id === unitId);

		if (!storeItem || !unitDetails)
		{
			return;
		}

		entity.itemTransfersItems.value = [...entity.itemTransfersItems.value, createTransferItem(storeItem, unitDetails)];
	};

	const handleStoreItemSelect = (storeItem: ItemDto, selectedIupm?: ItemUnitPricingMethodDto) =>
	{
		const defaultMethod = selectedIupm ?? storeItem.itemUnitPricingMethods[0];

		if (!defaultMethod)
		{
			throw Error("IUPM should be selected");
		}

		const list = [...(entity.itemTransfersItems.value || [])];
		const existingIndex = list.findIndex((i) => i.itemId.value === storeItem.id && i.itemUnitPricingMethodId.value === defaultMethod.id);

		if (existingIndex !== -1 && list[existingIndex])
		{
			list[existingIndex].quantity.value += 1;
			entity.itemTransfersItems.value = list;
		}
		else
		{
			entity.itemTransfersItems.value = [...list, createTransferItem(storeItem, defaultMethod)];
		}
	};

	const removeUnit = (row: ItemTransfersItem) =>
	{
		entity.itemTransfersItems.value = entity.itemTransfersItems?.value.filter((i) => i.id.value !== row.id.value) || [];
	};

	const removeEntireItem = (itemId: number) =>
	{
		entity.itemTransfersItems.value = entity.itemTransfersItems?.value.filter((i) => i.itemId.value !== itemId) || [];
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
						onSelect={ handleStoreItemSelect }
					/>
				) }
			</div>

			{ groupedItems.length > 0
				? (
					<div className="w-full overflow-x-auto border border-border rounded-lg shadow-sm bg-background">
						<table className="w-full text-sm text-right">
							<thead className="bg-muted/40 border-b border-border">
							<tr>
								<th className="p-4 font-semibold w-10 text-center text-muted-foreground">
									{ t("itemTransfers.number") }
								</th>
								<th className="p-4 font-semibold text-start w-1/4">{ t("itemTransfers.itemName") }</th>
								<th className="p-4 font-semibold text-start w-1/2">{ t("itemTransfers.quantity") }</th>
								<th className="p-4 font-semibold w-16 text-center"></th>
							</tr>
							</thead>
							<tbody>
							{ groupedItems.map((group, index) =>
							{
								const itemId = group[0]?.itemId.value;
								if (itemId == undefined)
								{
									throw Error("Item Id should not be empty");
								}

								const availableUnits = getAvailableUnits(itemId, group);

								return (
									<tr
										key={ itemId }
										className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
									>
										<td className="p-4 text-center font-bold text-muted-foreground align-top pt-5">
											{ index + 1 }
										</td>

										<td className="p-4 text-start align-top pt-5">
											<div
												className="font-semibold text-foreground">{ group[0]?.itemName.value }</div>
										</td>

										<td className="py-4 px-2">
											<div className="flex flex-col gap-2">
												{ group.map((row) => (
													<div key={ row.id.value } className="flex gap-2 items-start">
														<div
															className="bg-muted px-3 py-2 rounded-md text-xs font-medium w-32 truncate text-center border shrink-0 mt-0.5">
															{ row.itemUnitPricingMethodName.value }
														</div>
														<div className="flex-1">
															<NumberField
																label=""
																min={ 0 }
																max={ Math.max(0, getQuantities(row, group).MaxQuantity) }
																value={ row.quantity }
																disabled={ entity.mode.value === ChangeableEntityMode.Update }
															/>
															{ entity.mode.value === ChangeableEntityMode.Create && (
																<div
																	className="text-xs font-semibold text-destructive mt-1 text-start">
																	{ t("itemTransfers.available") }: { getQuantities(row, group).availableQuantity }
																</div>
															) }
														</div>
														{ entity.mode.value === ChangeableEntityMode.Create && (
															<Button
																type="button"
																variant="ghost"
																size="icon"
																className="text-red-500 hover:text-red-700 hover:bg-red-50 h-9 w-9 shrink-0"
																onClick={ () => removeUnit(row) }
															>
																<X className="w-4 h-4"/>
															</Button>
														) }
													</div>
												)) }

												{ entity.mode.value === ChangeableEntityMode.Create && availableUnits.length > 0 && (
													<div className="mt-1">
														<SelectField<number>
															options={ availableUnits.map((iupm) => ({
																label: iupm.itemUnitPricingMethodName,
																value: iupm.id
															})) }
															placeholder={ t("itemTransfers.selectPricingMethod") }
															onValueChange={ (unitId) => addUnitToItem(itemId, unitId) }
														/>
													</div>
												) }
											</div>
										</td>

										{ entity.mode.value === ChangeableEntityMode.Create && (
											<td className="p-4 text-center align-top pt-4">
												<Button
													type="button"
													variant="ghost"
													size="icon"
													className="text-red-600 hover:text-red-900 hover:bg-red-100"
													onClick={ () => removeEntireItem(itemId) }
												>
													<Trash2 className="w-5 h-5"/>
												</Button>
											</td>
										) }
									</tr>
								);
							}) }
							</tbody>
						</table>
					</div>
				)
				: (
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
				) }
		</div>
	);
}