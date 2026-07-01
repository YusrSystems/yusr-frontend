import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources";
import StoresSearchableSelect from "@/core/components/searchableSelect/storesSearchableSelect";
import { Cubits } from "@/core/services/cubits";
import { Services } from "@/core/services/services";
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
	SystemPermissionsActions,
	TextField
} from "yusr-ui";
import { ItemType } from "@/core/data/item.ts";
import ItemTransfer, { ItemTransferDto } from "../../core/data/itemTransfer";
import ItemTransferTable from "./itemTransferTable";


export default function ChangeItemTransferDialog(
	{dto, service, onSuccess}: CommonChangeDialogProps<ItemTransferDto>
)
{
	useSignals();
	const {t} = useTranslation(["stocking", "common"]);
	const entity = useMemo(() => signal<ItemTransfer>(dto ? ItemTransfer.load(dto) : ItemTransfer.create()), []);
	const isLoading = useMemo(() => signal<boolean>(false), []);
	const title = entity.value.mode.value === ChangeableEntityMode.Create
		? t("itemTransfers.addNewTitle")
		: `${ t("common:crudRow.edit") } ${ t("itemTransfers.entityName") }`;

	useEffect(() =>
	{
		if (entity.value.mode.value === ChangeableEntityMode.Update && entity.value?.id.value)
		{
			isLoading.value = true;
			const fetch = async () =>
			{
				const res = await service.Get(entity.value.id.value);
				if (res.data != undefined)
				{
					entity.value = ItemTransfer.load(res.data);
				}
				isLoading.value = false;
			};
			fetch();
		}
		else
		{
			Cubits.stores.init();
		}
	}, []);

	useEffect(() =>
	{
		if (entity.value.mode.value === ChangeableEntityMode.Create && entity.value?.fromStoreId.value)
		{
			Cubits.items.init([ItemType.Product], {storeId: entity.value.fromStoreId.value});
		}
	}, [entity.value.fromStoreId.value, entity.value.mode.value]);

	if (
		(entity.value.mode.value === ChangeableEntityMode.Create
			&& !Services.auth.hasAuth(SystemPermissionsResources.ItemTransfers, SystemPermissionsActions.Add))
		|| (entity.value.mode.value === ChangeableEntityMode.Update
			&& !Services.auth.hasAuth(SystemPermissionsResources.ItemTransfers, SystemPermissionsActions.Update))
	)
	{
		return <ChangeDialog.Unauthorized/>;
	}

	if (isLoading.value)
	{
		return (
			<ChangeDialog>
				<ChangeDialog.Header title={ title }/>
				<Loading entityName={ t("itemTransfers.entityName") }/>
			</ChangeDialog>
		);
	}

	return (
		<ChangeDialog className="sm:max-w-7xl">
			<ChangeDialog.Header title={ title }/>

			<div className="max-h-[75vh] overflow-y-auto px-2 pb-2">
				<FieldGroup>
					<FieldsSection columns={ 3 }>
						<TextField
							label={ t("itemTransfers.date") }
							required
							value={ entity.value.date }
							disabled
						/>
						<FormField
							label={ t("itemTransfers.fromStore") }
							required
							error={ entity.value.getError("fromStoreId") }
						>
							<StoresSearchableSelect
								id={ entity.value.fromStoreId }
								label={ entity.value.fromStoreName }
								disabled={ entity.value.mode.value === ChangeableEntityMode.Update }
								onSelect={ () =>
								{
									entity.value.itemTransfersItems.value = [];
								} }
							/>
						</FormField>

						<FormField
							label={ t("itemTransfers.toStore") }
							required
							error={ entity.value.getError("toStoreId") }
						>
							<StoresSearchableSelect
								id={ entity.value.toStoreId }
								label={ entity.value.toStoreName }
								disabled={ entity.value.mode.value === ChangeableEntityMode.Update }
							/>
						</FormField>
					</FieldsSection>

					<FieldsSection columns={ 1 }>
						<TextField
							label={ t("itemTransfers.description") }
							value={ entity.value.description }
						/>
					</FieldsSection>

					<FieldsSection columns={ 1 }>
						<ItemTransferTable entity={ entity.value }/>
					</FieldsSection>
				</FieldGroup>
			</div>

			<ChangeDialog.Footer>
				<ChangeDialog.Close/>
				<ChangeDialog.SaveButton<ItemTransfer, ItemTransferDto>
					entity={ entity }
					service={ service }
					onSuccess={ (data) => onSuccess?.(data, entity.value.mode.value) }
				/>
			</ChangeDialog.Footer>
		</ChangeDialog>
	);
}
