import StoresSearchableSelect from "@/core/components/searchableSelect/storesSearchableSelect";
import type Item from "@/core/data/item";
import { ItemStore } from "@/core/data/itemStore";
import { useSignals } from "@preact/signals-react/runtime";
import { Plus, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button, ChangeableEntityMode, FormField, NumberField, TablePreview, TextField } from "yusr-ui";
import ErpCurrencyIcon from "@/core/components/erpCurrencyIcon.tsx";


export default function StorageTab({entity}: { entity: Item; })
{
	useSignals();
	const {t} = useTranslation("stocking");

	const addStore = () => entity.itemStores.value = [...entity.itemStores.value, ItemStore.create()];
	const removeStore = (index: number) =>
	{
		entity.itemStores.value = entity.itemStores.value.filter((_, i) => i !== index);
	};

	const errorMessage = entity.getError("itemStores");

	return (
		<div className="space-y-6 animate-in fade-in">
			<div className="grid grid-cols-2 gap-6">
				<NumberField
					label={ t("items.minQuantity") }
					value={ entity.minQuantity }
				/>
				<NumberField
					label={ t("items.maxQuantity") }
					value={ entity.maxQuantity }
				/>
				<TextField
					label={ t("items.locationInStore") }
					value={ entity.location }
				/>
				<NumberField
					label={ t("items.totalCurrentQuantity") }
					value={ entity.quantity }
					disabled
					className="bg-muted font-bold"
				/>
			</div>

			<div className="pt-4">
				<div className="flex justify-between items-center mb-4">
					<h3 className="font-bold">{ t("items.storageMethods") }</h3>
					<Button type="button" size="sm" onClick={ addStore }>
						<Plus className="w-4 h-4 me-2"/> { t("items.addStorageMethod") }
					</Button>
				</div>

				<div
					className="bg-muted/20 rounded-lg border overflow-hidden"
				>
					<table className="w-full text-sm text-right">
						<thead className="bg-muted/50 text-muted-foreground">
						<tr>
							<th className="p-3 w-16 text-start">{ t("items.number") }</th>
							<th className="p-3 w-48 text-start">{ t("items.store") }</th>
							<th className="p-3 w-48 text-start">{ t("items.currentQuantity") }</th>
							<th className="p-3 w-48 text-start">{ t("items.averageCost", "متوسط التكلفة") }</th>
							<th className="p-3 w-16 text-center"></th>
						</tr>
						</thead>
						<tbody>
						{ entity.itemStores.value?.map((store, index) => (
							<tr key={ index } className="border-t border-muted">
								<td className="p-3 font-bold text-start">{ index + 1 }</td>
								<td className="p-3">
									<FormField
										label=""
										error={ store.getError("storeId") }
									>
										<StoresSearchableSelect
											id={ store.storeId }
											label={ store.storeName }
											disabled={ entity.mode.value === ChangeableEntityMode.Update && !!store.id?.value }
										/>
									</FormField>
								</td>
								<td className="p-3">
									<NumberField
										label=""
										value={ store.quantity }
										disabled
									/>
								</td>
								<td className="p-3">
									<NumberField
										label=""
										value={ store.averageCost }
										currency={ <ErpCurrencyIcon/> }
										disabled
									/>
								</td>
								<td className="p-3 text-center">
									<Button
										type="button"
										variant="ghost"
										size="icon"
										className="text-red-500 hover:text-red-700 hover:bg-red-100"
										onClick={ () => removeStore(index) }
									>
										<Trash2 className="w-4 h-4"/>
									</Button>
								</td>
							</tr>
						)) }
						</tbody>
					</table>
					{ entity.itemStores.value.length <= 0 && (
						<TablePreview.Empty/>
					) }
				</div>

				{ errorMessage.value && (
					<div
						className="p-3 mt-3 text-sm font-medium text-destructive bg-destructive/10 rounded-md border border-destructive/20">
						{ errorMessage.value }
					</div>
				) }
			</div>
		</div>
	);
}