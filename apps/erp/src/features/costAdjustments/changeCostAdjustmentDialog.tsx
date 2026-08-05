import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources";
import ItemsSearchableSelect from "@/core/components/searchableSelect/itemsSearchableSelect";
import StoresSearchableSelect from "@/core/components/searchableSelect/storesSearchableSelect";
import CostAdjustment, { type CostAdjustmentDto } from "@/core/data/costAdjustment";
import { Cubits } from "@/core/services/cubits";
import { Services } from "@/core/services/services";
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
	NumberField,
	SystemPermissionsActions,
	TextField
} from "yusr-ui";
import { signal } from "@preact/signals-react";
import { ItemType } from "@/core/data/item.ts";


export default function ChangeCostAdjustmentDialog({
	dto,
	service,
	onSuccess
}: CommonChangeDialogProps<CostAdjustmentDto>)
{
	useSignals();
	const {t} = useTranslation(["stocking", "common"]);
	// eslint-disable-next-line react-hooks/exhaustive-deps -- intentional: signal created once on mount, not re-synced with props
	const entity = useMemo(() => signal<CostAdjustment>(dto ? CostAdjustment.load(dto) : CostAdjustment.create()), []);

	useEffect(() =>
	{
		Cubits.stores.init();
	}, []);

	useEffect(() =>
	{
		if (entity.value.storeId.value && entity.value.date.value)
		{
			Cubits.items.initForStoreAndDate([ItemType.Product], entity.value.storeId.value, entity.value.date.value);
		}
	}, [entity.value.storeId.value, entity.value.date.value]);

	if (
		(entity.value.mode.value === ChangeableEntityMode.Create &&
			!Services.auth.hasAuth(SystemPermissionsResources.CostAdjustments, SystemPermissionsActions.Add)) ||
		(entity.value.mode.value === ChangeableEntityMode.Update &&
			!Services.auth.hasAuth(SystemPermissionsResources.CostAdjustments, SystemPermissionsActions.Update))
	)
	{
		return <ChangeDialog.Unauthorized/>;
	}

	const title = entity.value.mode.value === ChangeableEntityMode.Create
		? t("costAdjustments.addNewTitle")
		: `${ t("common:crudRow.edit") } ${ t("costAdjustments.entityName") }`;

	return (
		<ChangeDialog className="sm:max-w-3xl">
			<ChangeDialog.Header title={ title }/>

			<FieldGroup>
				<FieldsSection columns={ 3 }>
					<DateField
						label={ t("costAdjustments.date") }
						required
						value={ entity.value.date }
						error={ entity.value.getError("date") }
						disabled={ entity.value.mode.value === ChangeableEntityMode.Update }
					/>

					<FormField
						label={ t("costAdjustments.store", "المستودع") }
						required
						error={ entity.value.getError("storeId") }
					>
						<StoresSearchableSelect
							id={ entity.value.storeId }
							label={ entity.value.storeName }
							disabled={ entity.value.mode.value === ChangeableEntityMode.Update }
							onSelect={ () =>
							{
								entity.value.itemId.value = undefined;
								entity.value.itemName.value = "";
								entity.value.oldCost.value = 0;
								entity.value.quantity.value = 0;
								entity.value.newCost.value = 0;
							} }
						/>
					</FormField>

					<FormField
						label={ t("costAdjustments.item") }
						required
						error={ entity.value.getError("itemId") }
					>
						<ItemsSearchableSelect
							id={ entity.value.itemId }
							label={ entity.value.itemName }
							disabled={ entity.value.mode.value === ChangeableEntityMode.Update || !entity.value.storeId.value }
							onSelect={ (item) =>
							{
								if (item)
								{
									entity.value.itemName.value = item.name;
									const storeDetails = item.itemStores?.find(s => s.storeId === entity.value.storeId.value);
									entity.value.oldCost.value = storeDetails?.averageCost ?? 0;
									entity.value.quantity.value = storeDetails?.quantity ?? 0;
									entity.value.newCost.value = storeDetails?.averageCost ?? 0;
								}
							} }
						/>
					</FormField>
				</FieldsSection>

				<FieldsSection columns={ 3 }>
					<NumberField
						label={ t("costAdjustments.quantity") }
						value={ entity.value.quantity }
						disabled
					/>
					<NumberField
						label={ t("costAdjustments.oldCost") }
						value={ entity.value.oldCost }
						disabled
					/>
					<NumberField
						label={ t("costAdjustments.newCost") }
						required
						min={ 0 }
						value={ entity.value.newCost }
						error={ entity.value.getError("newCost") }
						disabled={ entity.value.mode.value === ChangeableEntityMode.Update }
					/>
				</FieldsSection>

				<TextField
					label={ t("costAdjustments.notes") }
					value={ entity.value.notes }
				/>
			</FieldGroup>

			<ChangeDialog.Footer>
				<ChangeDialog.Close/>

				<ChangeDialog.SaveButton<CostAdjustment, CostAdjustmentDto>
					entity={ entity }
					service={ service }
					onSuccess={ (data) => onSuccess?.(data, entity.value.mode.value) }
				/>
			</ChangeDialog.Footer>
		</ChangeDialog>
	);
}