import StoresSearchableSelect from "@/core/components/searchableSelect/storesSearchableSelect";
import type { StocktakingDto } from "@/core/data/stocktaking";
import Stocktaking from "@/core/data/stocktaking";
import { StocktakingItem } from "@/core/data/stocktakingItem";
import { Cubits } from "@/core/services/cubits";
import { signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ChangeableEntityMode, type CommonChangeDialogProps } from "yusr-ui";
import { ChangeDialog, FieldGroup, FieldsSection, FormField, Loading, TextField } from "yusr-ui";
import { ItemType } from "@/core/data/item.ts";
import StocktakingItemsTable from "./stocktakingItemsTable";


export default function ChangeStocktakingDialog(
	{entity, service, onSuccess, addDialogTitle, updateDialogTitle}:
	& CommonChangeDialogProps<Stocktaking, StocktakingDto>
		& {
		addDialogTitle: string;
		updateDialogTitle: string;
	}
)
{
	useSignals();
	const {t} = useTranslation(["stocking", "common"]);
	const isLoading = useMemo(() => signal<boolean>(false), []);
	const currentEntity = useMemo(() => signal<Stocktaking>(entity), [entity]);

	useEffect(() =>
	{
		Cubits.stores.init();

		if (currentEntity.value.mode.value === ChangeableEntityMode.Update && currentEntity.value?.id.value)
		{
			isLoading.value = true;
			const fetch = async () =>
			{
				const res = await service.Get(currentEntity.value.id.value);
				if (res.data != undefined)
				{
					res.data.date.value = new Date(res.data.date.value).toLocaleDateString("en-CA");
					currentEntity.value = Stocktaking.load(res.data.toJson());
				}
				isLoading.value = false;
			};
			void fetch();
		}
	}, [currentEntity, isLoading, service]);

	useEffect(() =>
	{
		if (currentEntity.value?.storeId.value)
		{
			Cubits.items.init([ItemType.Product], {storeId: currentEntity.value.storeId.value});
		}
	}, [currentEntity.value.storeId.value]);

	const title = currentEntity.value.mode.value === ChangeableEntityMode.Create
		? addDialogTitle
		: updateDialogTitle;

	if (isLoading.value)
	{
		return (
			<ChangeDialog>
				<ChangeDialog.Header title={ title }/>
				<Loading entityName={ t("stocktakings.entityName") }/>
			</ChangeDialog>
		);
	}

	return (
		<ChangeDialog className="sm:max-w-7xl">
			<ChangeDialog.Header title={ title }/>

			<div className="max-h-[75vh] overflow-y-auto px-2 pb-2">
				<FieldGroup>
					<FieldsSection columns={ 2 }>
						<TextField
							label={ t("stocktakings.stocktakingDate") }
							value={ currentEntity.value.date }
							required
							disabled
						/>

						<FormField
							label={ t("stocktakings.store") }
							required
							error={ currentEntity.value.getError("storeId") }
						>
							<StoresSearchableSelect
								id={ currentEntity.value.storeId }
								label={ currentEntity.value.storeName }
								disabled={ currentEntity.value.mode.value === ChangeableEntityMode.Update }
								onSelect={ (store) =>
								{
									currentEntity.value.storeId.value = store?.id.value;
									currentEntity.value.storeName.value = store?.name.value;
									currentEntity.value.items.value = [];
								} }
							/>
						</FormField>
					</FieldsSection>

					<TextField
						label={ t("stocktakings.description") }
						value={ currentEntity.value.description }
					/>

					<StocktakingItemsTable
						entity={ currentEntity.value }
						createInstance={ () => StocktakingItem.create() }
					/>
				</FieldGroup>
			</div>

			<ChangeDialog.Footer>
				<ChangeDialog.Close/>
				<ChangeDialog.SaveButton<Stocktaking, StocktakingDto>
					entity={ currentEntity.value }
					service={ service }
					onSuccess={ (data) => onSuccess?.(data) }
				/>
			</ChangeDialog.Footer>
		</ChangeDialog>
	);
}
