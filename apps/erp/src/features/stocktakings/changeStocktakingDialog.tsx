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
	CheckboxField,
	type CommonChangeDialogProps,
	DateField,
	FieldGroup,
	FieldsSection,
	FormField,
	type ICrudResource,
	Loading,
	TextAreaField
} from "yusr-ui";
import { ItemType } from "@/core/data/item.ts";
import StocktakingItemsTable from "./stocktakingItemsTable";
import { TransactionStatus } from "#/types/transactionStatus.ts";


export default function ChangeStocktakingDialog(
	{dto, resource, onSuccess, addDialogTitle, updateDialogTitle, showIsOpeningBalance}:
		CommonChangeDialogProps<StocktakingDto> & {
		resource: ICrudResource<StocktakingDto>;
		addDialogTitle: string;
		updateDialogTitle: string;
		showIsOpeningBalance?: boolean;
	}
)
{
	useSignals();
	const {t} = useTranslation(["stocking", "common"]);
	const isLoading = useMemo(() => signal<boolean>(false), []);
	const entity = useMemo(() => signal<Stocktaking>(dto ? Stocktaking.load(dto) : Stocktaking.create()), [dto]);

	useEffect(() =>
	{
		if (entity.value.mode.value !== ChangeableEntityMode.Create)
		{
			return;
		}

		void Cubits.stores.init();
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

	const isDraft = entity.value.transactionStatus.value === TransactionStatus.Draft;
	const isPosted = entity.value.transactionStatus.value === TransactionStatus.Posted;
	const isVoided = entity.value.transactionStatus.value === TransactionStatus.Voided;

	return (
		<ChangeDialog className="sm:max-w-7xl max-h-[94dvh] flex flex-col overflow-hidden">
			<ChangeDialog.Header title={ title }/>

			<div className="flex-1 min-h-0 overflow-y-auto px-1 sm:px-2 pb-2">
				<FieldGroup>
					<FieldsSection columns={ {base: 1, md: 2} }>
						<DateField
							label={ t("stocktakings.date") }
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

						{ showIsOpeningBalance && (
							<FormField
								label={ t("common:isOpeningBalance", "هذه التسوية عبارة عن رصيد افتتاحي للمخزون") }
								required
							>
								<CheckboxField
									checked={ entity.value.isOpeningBalance }
									disabled={ !isDraft }
								/>
							</FormField>
						) }
					</FieldsSection>

					<TextAreaField
						label={ t("stocktakings.description") }
						value={ entity.value.description }
						collapsible
						collapsedHeight={ 60 }
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
							resource={ resource }
							variant="outline"
							label={ t("common:saveAsDraft", "حفظ كمسودة") }
							transformData={ (data) =>
							{
								data.transactionStatus = TransactionStatus.Draft;
								return data;
							} }
							onSuccess={ (data) => onSuccess?.(data, entity.value.mode.value) }
							disabled={ isVoided }
						/>
						<ChangeDialog.SaveButton<Stocktaking, StocktakingDto>
							entity={ entity }
							resource={ resource }
							label={ t("common:saveAndPost", "حفظ واعتماد") }
							transformData={ (data) =>
							{
								data.transactionStatus = TransactionStatus.Posted;
								return data;
							} }
							onSuccess={ (data) => onSuccess?.(data, entity.value.mode.value) }
							checkEntityChanges={ false }
							disabled={ isVoided }
						/>
					</>
				) }
				{ (isPosted || isVoided) && (
					<ChangeDialog.SaveButton<Stocktaking, StocktakingDto>
						entity={ entity }
						resource={ resource }
						label={ t("common:save", "حفظ") }
						onSuccess={ (data) => onSuccess?.(data, entity.value.mode.value) }
					/>
				) }
			</ChangeDialog.Footer>
		</ChangeDialog>
	);
}