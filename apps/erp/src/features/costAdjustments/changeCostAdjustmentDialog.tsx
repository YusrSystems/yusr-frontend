import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources";
import ItemsSearchableSelect from "@/core/components/searchableSelect/itemsSearchableSelect";
import CostAdjustment, { type CostAdjustmentDto } from "@/core/data/costAdjustment";
import { Cubits } from "@/core/services/cubits";
import { Services } from "@/core/services/services";
import { useSignals } from "@preact/signals-react/runtime";
import { useEffect } from "react";
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


export default function ChangeCostAdjustmentDialog({
	entity,
	service,
	onSuccess
}: CommonChangeDialogProps<CostAdjustment, CostAdjustmentDto>)
{
	useSignals();
	const {t} = useTranslation(["stocking", "common"]);

	useEffect(() =>
	{
		Cubits.items.init();
	}, []);

	if (
		(entity.mode.value === ChangeableEntityMode.Create &&
			!Services.auth.hasAuth(SystemPermissionsResources.CostAdjustments, SystemPermissionsActions.Add)) ||
		(entity.mode.value === ChangeableEntityMode.Update &&
			!Services.auth.hasAuth(SystemPermissionsResources.CostAdjustments, SystemPermissionsActions.Update))
	)
	{
		return <ChangeDialog.Unauthorized/>;
	}

	const title = entity.mode.value === ChangeableEntityMode.Create
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
						value={ entity.date }
						error={ entity.getError("date") }
						disabled
					/>

					<FormField
						label={ t("costAdjustments.item") }
						required
						error={ entity.getError("itemId") }
					>
						<ItemsSearchableSelect
							id={ entity.itemId }
							label={ entity.itemName }
							disabled={ entity.mode.value === ChangeableEntityMode.Update }
							onSelect={ (item) =>
							{
								if (item)
								{
									entity.itemName.value = item.name.value;
									entity.oldCost.value = item.cost.value;
									entity.quantity.value = item.quantity.value;
									// Optionally pre-fill new cost with old cost to make editing easier
									if (entity.newCost.value === 0)
									{
										entity.newCost.value = item.cost.value;
									}
								}
							} }
						/>
					</FormField>
				</FieldsSection>

				<FieldsSection columns={ 3 }>
					<NumberField
						label={ t("costAdjustments.quantity") }
						value={ entity.quantity }
						disabled
					/>
					<NumberField
						label={ t("costAdjustments.oldCost") }
						value={ entity.oldCost }
						disabled
					/>
					<NumberField
						label={ t("costAdjustments.newCost") }
						required
						min={ 0 }
						value={ entity.newCost }
						error={ entity.getError("newCost") }
					/>
				</FieldsSection>

				<TextField
					label={ t("costAdjustments.notes") }
					value={ entity.notes }
				/>
			</FieldGroup>

			<ChangeDialog.Footer>
				<ChangeDialog.Close/>

				<ChangeDialog.SaveButton<CostAdjustment, CostAdjustmentDto>
					entity={ entity }
					service={ service }
					onSuccess={ (data) => onSuccess?.(data) }
				/>
			</ChangeDialog.Footer>
		</ChangeDialog>
	);
}