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
	DateField,
	FieldGroup,
	FieldsSection,
	FormField,
	Loading,
	TextField
} from "yusr-ui";
import { ItemType } from "@/core/data/item.ts";
import StocktakingItemsTable from "./stocktakingItemsTable";
import { TransactionStatus } from "@/core/types/transactionStatus";


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
	// eslint-disable-next-line react-hooks/exhaustive-deps -- intentional: signal created once on mount, not re-synced with props
	const entity = useMemo(() => signal<Stocktaking>(dto ? Stocktaking.load(dto) : Stocktaking.create()), []);

	useEffect(() =>
	{
		if (entity.value.mode.value !== ChangeableEntityMode.Create)
		{
			return;
		}

		Cubits.stores.init();
	}, [entity.value.mode.value]);

	useEffect(() =>
	{
		if (entity.value.mode.value !== ChangeableEntityMode.Create)
		{
			return;
		}

		if (entity.value.storeId.value && entity.value.date.value)
		{
			Cubits.items.initForStoreAndDate([ItemType.Product], entity.value.storeId.value, entity.value.date.value);
		}
	}, [entity.value.mode.value, entity.value.storeId.value, entity.value.date.value]);

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

	const isDraft = entity.value.statusId.value === TransactionStatus.Draft;
	const isPosted = entity.value.statusId.value === TransactionStatus.Posted;
	const isVoided = entity.value.statusId.value === TransactionStatus.Voided;

	return (
		<ChangeDialog className="sm:max-w-7xl">
			<ChangeDialog.Header title={ title }/>

			<div className="max-h-[75vh] overflow-y-auto px-2 pb-2">
				<FieldGroup>
					<FieldsSection columns={ 2 }>
						<DateField
							label={ t("stocktakings.stocktakingDate") }
							value={ entity.value.date }
							required
							disabled={ !isDraft }
							onChange={ (val) =>
							{
								if (entity.value.mode.value === ChangeableEntityMode.Create && val)
								{
									entity.value.items.value = [];
								}
							} }
						/>

						<FormField
							label={ t("stocktakings.store") }
							required
							error={ entity.value.getError("storeId") }
						>
							<StoresSearchableSelect
								id={ entity.value.storeId }
								label={ entity.value.storeName }
								disabled={ !isDraft }
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
						disabled={ !isDraft }
					/>

					<StocktakingItemsTable
						entity={ entity.value }
						createInstance={ () => StocktakingItem.create() }
					/>
				</FieldGroup>
			</div>

			<ChangeDialog.Footer>
				<ChangeDialog.Close/>
				{ isDraft && (
					<>
						<ChangeDialog.SaveButton<Stocktaking, StocktakingDto>
							entity={ entity }
							service={ service }
							variant="outline"
							label={ t("common:saveAsDraft", "حفظ كمسودة") }
							transformData={ (data) =>
							{
								data.statusId = TransactionStatus.Draft;
								return data;
							} }
							onSuccess={ (data) => onSuccess?.(data, entity.value.mode.value) }
							disabled={ isVoided }
						/>
						<ChangeDialog.SaveButton<Stocktaking, StocktakingDto>
							entity={ entity }
							service={ service }
							label={ t("common:saveAndPost", "حفظ واعتماد") }
							transformData={ (data) =>
							{
								data.statusId = TransactionStatus.Posted;
								return data;
							} }
							onSuccess={ (data) => onSuccess?.(data, entity.value.mode.value) }
							disabled={ isVoided }
						/>
					</>
				) }
				{ isPosted && (
					<ChangeDialog.SaveButton<Stocktaking, StocktakingDto>
						entity={ entity }
						service={ service }
						label={ t("common:save", "حفظ") }
						onSuccess={ (data) => onSuccess?.(data, entity.value.mode.value) }
						disabled={ isVoided }
					/>
				) }
			</ChangeDialog.Footer>
		</ChangeDialog>
	);
}