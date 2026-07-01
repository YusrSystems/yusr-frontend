import StoresSearchableSelect from "@/core/components/searchableSelect/storesSearchableSelect";
import type { StocktakingDto } from "@/core/data/stocktaking";
import Stocktaking from "@/core/data/stocktaking";
import { StocktakingItem } from "@/core/data/stocktakingItem";
import { Cubits } from "@/core/services/cubits";
import { signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
	ChangeableEntityMode,
	ChangeDialog,
	type CommonChangeDialogProps,
	FieldGroup,
	FieldsSection,
	FormField,
	Loading,
	TextField
} from "yusr-ui";
import { ItemType } from "@/core/data/item.ts";
import StocktakingItemsTable from "./stocktakingItemsTable";


export default function ChangeStocktakingDialog(
	{dto, service, onSuccess, addDialogTitle, updateDialogTitle}:
	& CommonChangeDialogProps<StocktakingDto>
		& {
		addDialogTitle: string;
		updateDialogTitle: string;
	}
)
{
	useSignals();
	const {t} = useTranslation(["stocking", "common"]);
	const isLoading = useMemo(() => signal<boolean>(false), []);
	const entity = useMemo(() => signal<Stocktaking>(dto ? Stocktaking.load(dto) : Stocktaking.create()), []);

	useEffect(() =>
	{
		Cubits.stores.init();

		if (entity.value.mode.value === ChangeableEntityMode.Update && entity.value?.id.value)
		{
			isLoading.value = true;
			const fetch = async () =>
			{
				const res = await service.Get(entity.value.id.value);
				if (res.data != undefined)
				{
					res.data.date = new Date(res.data.date).toLocaleDateString("en-CA");
					entity.value = Stocktaking.load(res.data);
				}
				isLoading.value = false;
			};
			void fetch();
		}
	}, [entity, isLoading, service]);

	useEffect(() =>
	{
		if (entity.value?.storeId.value)
		{
			Cubits.items.init([ItemType.Product], {storeId: entity.value.storeId.value});
		}
	}, [entity.value.storeId.value]);

	const title = entity.value.mode.value === ChangeableEntityMode.Create
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
							value={ entity.value.date }
							required
							disabled
						/>

						<FormField
							label={ t("stocktakings.store") }
							required
							error={ entity.value.getError("storeId") }
						>
							<StoresSearchableSelect
								id={ entity.value.storeId }
								label={ entity.value.storeName }
								disabled={ entity.value.mode.value === ChangeableEntityMode.Update }
								onSelect={ (store) =>
								{
									entity.value.storeId.value = store?.id;
									entity.value.storeName.value = store?.name;
									entity.value.items.value = [];
								} }
							/>
						</FormField>
					</FieldsSection>

					<TextField
						label={ t("stocktakings.description") }
						value={ entity.value.description }
					/>

					<StocktakingItemsTable
						entity={ entity.value }
						createInstance={ () => StocktakingItem.create() }
					/>
				</FieldGroup>
			</div>

			<ChangeDialog.Footer>
				<ChangeDialog.Close/>
				<ChangeDialog.SaveButton<Stocktaking, StocktakingDto>
					entity={ entity }
					service={ service }
					onSuccess={ (data) => onSuccess?.(data, entity.value.mode.value) }
				/>
			</ChangeDialog.Footer>
		</ChangeDialog>
	);
}
