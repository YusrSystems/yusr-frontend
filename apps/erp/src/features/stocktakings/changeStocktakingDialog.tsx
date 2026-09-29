import StoresSearchableSelect from "@/core/components/searchableSelect/storesSearchableSelect";
import { type StocktakingDto } from "@/core/data/stocktaking";
import type ItemsSettlement from "@/core/data/itemsSettlement";
import { ItemsSettlementDto } from "@/core/data/itemsSettlement";
import { StocktakingItem } from "@/core/data/stocktakingItem";
import { Cubits } from "@/core/services/cubits";
import { type Signal, signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
	ChangeableEntity,
	ChangeableEntityMode,
	ChangeDialog,
	CheckboxField,
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


export interface IStocktakingEntity<TDto extends StocktakingDto> extends ChangeableEntity<TDto>
{
	date: Signal<string>;
	storeId: Signal<number | undefined>;
	storeName: Signal<string | undefined>;
	description: Signal<string | undefined>;
	items: Signal<StocktakingItem[]>;
	rowVer: Signal<number>;
}

function hasStatusWorkflow(data: StocktakingDto): data is ItemsSettlementDto
{
	return "transactionStatus" in data;
}

export interface ChangeStocktakingDialogProps<
	TEntity extends IStocktakingEntity<TDto>,
	TDto extends StocktakingDto
>
{
	dto?: TDto;
	resource: ICrudResource<TDto>;
	addDialogTitle: string;
	updateDialogTitle: string;
	createEntity: (dto?: TDto) => TEntity;
	onSuccess?: (newData: TDto, mode: ChangeableEntityMode) => void;
	showIsOpeningBalance?: boolean;
	hasWorkflow?: boolean;
}

export default function ChangeStocktakingDialog<
	TEntity extends IStocktakingEntity<TDto>,
	TDto extends StocktakingDto
>({
	dto,
	resource,
	onSuccess,
	createEntity,
	addDialogTitle,
	updateDialogTitle,
	showIsOpeningBalance = false,
	hasWorkflow = false
}: ChangeStocktakingDialogProps<TEntity, TDto>)
{
	useSignals();
	const {t} = useTranslation(["stocking", "common"]);
	const isLoading = useMemo(() => signal<boolean>(false), []);
	const entity = useMemo(() => signal<TEntity>(createEntity(dto)), [dto]);

	const settlementEntity = hasWorkflow ? (entity.value as unknown as ItemsSettlement) : null;
	const isDraft = settlementEntity ? settlementEntity.transactionStatus.value === TransactionStatus.Draft : true;
	const isVoided = settlementEntity ? settlementEntity.transactionStatus.value === TransactionStatus.Voided : false;
	const isFullyEditable = hasWorkflow ? isDraft : true;
	const isUpdateMode = entity.value.mode.value === ChangeableEntityMode.Update;

	useEffect(() =>
	{
		if (!isFullyEditable) return;
		void Cubits.stores.init();
	}, [isFullyEditable]);

	useEffect(() =>
	{
		if (!isFullyEditable) return;
		if (entity.value.storeId.value && entity.value.date.value)
		{
			Cubits.items.initForStoreAndDate([ItemType.Product], entity.value.storeId.value, entity.value.date.value);
		}
	}, [isFullyEditable, entity.value.storeId.value, entity.value.date.value]);

	const title = !isUpdateMode ? addDialogTitle : updateDialogTitle;

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
						<DateField
							label={ t("stocktakings.date") }
							value={ entity.value.date }
							required
							disabled={ !isFullyEditable }
							onChange={ (val) =>
							{
								if (isFullyEditable && val)
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
								disabled={ !isFullyEditable }
								onSelect={ (store) =>
								{
									entity.value.storeId.value = store?.id;
									entity.value.storeName.value = store?.name;
									entity.value.items.value = [];
								} }
							/>
						</FormField>
						{ showIsOpeningBalance && settlementEntity && (
							<FormField
								label={ t("common:isOpeningBalance", "هذه التسوية عبارة عن رصيد افتتاحي للمخزون") }
								required
							>
								<CheckboxField
									checked={ settlementEntity.isOpeningBalance }
									disabled={ !isFullyEditable }
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
						isEditable={ isFullyEditable }
					/>
				</FieldGroup>
			</div>
			<ChangeDialog.Footer>
				<ChangeDialog.Close/>
				{ !hasWorkflow && (
					<ChangeDialog.SaveButton<TEntity, TDto>
						entity={ entity }
						resource={ resource }
						onSuccess={ (data) => onSuccess?.(data, entity.value.mode.value) }
					/>
				) }
				{ hasWorkflow && isDraft && (
					<>
						<ChangeDialog.SaveButton<TEntity, TDto>
							entity={ entity }
							resource={ resource }
							variant="outline"
							label={ t("common:saveAsDraft", "حفظ كمسودة") }
							transformData={ (data) =>
							{
								if (hasStatusWorkflow(data))
								{
									data.transactionStatus = TransactionStatus.Draft;
								}
								return data;
							} }
							onSuccess={ (data) => onSuccess?.(data, entity.value.mode.value) }
							disabled={ isVoided }
						/>
						<ChangeDialog.SaveButton<TEntity, TDto>
							entity={ entity }
							resource={ resource }
							label={ t("common:saveAndPost", "حفظ واعتماد") }
							transformData={ (data) =>
							{
								if (hasStatusWorkflow(data))
								{
									data.transactionStatus = TransactionStatus.Posted;
								}
								return data;
							} }
							onSuccess={ (data) => onSuccess?.(data, entity.value.mode.value) }
							checkEntityChanges={ false }
							disabled={ isVoided }
						/>
					</>
				) }
				{ hasWorkflow && !isDraft && (
					<ChangeDialog.SaveButton<TEntity, TDto>
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