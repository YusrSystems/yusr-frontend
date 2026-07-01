import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources";
import ItemsSearchableSelect from "@/core/components/searchableSelect/itemsSearchableSelect";
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
	FieldGroup,
	FieldsSection,
	FormField,
	NumberField,
	SystemPermissionsActions,
	TextField
} from "yusr-ui";
import { signal } from "@preact/signals-react";


export default function ChangeCostAdjustmentDialog({
	dto,
	service,
	onSuccess
}: CommonChangeDialogProps<CostAdjustmentDto>)
{
	useSignals();
	const {t} = useTranslation(["stocking", "common"]);
	const entity = useMemo(() => signal<CostAdjustment>(dto ? CostAdjustment.load(dto) : CostAdjustment.create()), []);

	useEffect(() =>
	{
		Cubits.items.init();
	}, []);

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
		<ChangeDialog className="sm:max-w-2xl">
			<ChangeDialog.Header title={ title }/>

			<FieldGroup>
				<FieldsSection columns={ 2 }>
					<TextField
						label={ t("costAdjustments.date") }
						type="date"
						required
						value={ entity.value.date }
						error={ entity.value.getError("date") }
						disabled
					/>

					<FormField
						label={ t("costAdjustments.item") }
						required
						error={ entity.value.getError("itemId") }
					>
						<ItemsSearchableSelect
							id={ entity.value.itemId }
							label={ entity.value.itemName }
							disabled={ entity.value.mode.value === ChangeableEntityMode.Update }
							onSelect={ (item) =>
							{
								if (item)
								{
									entity.value.itemName.value = item.name;
									entity.value.oldCost.value = item.cost;
									entity.value.quantity.value = item.quantity;
									// Optionally pre-fill new cost with old cost to make editing easier
									if (entity.value.newCost.value === 0)
									{
										entity.value.newCost.value = item.cost;
									}
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