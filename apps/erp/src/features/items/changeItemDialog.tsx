import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources";
import type { ItemDto } from "@/core/data/item";
import Item from "@/core/data/item";
import { Cubits } from "@/core/services/cubits";
import { Services } from "@/core/services/services";
import { signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import { Box, Database, DollarSign } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
	ChangeableEntityMode,
	ChangeDialog,
	type CommonChangeDialogProps,
	Loading,
	StorageType,
	SystemPermissionsActions,
	useStorageFile
} from "yusr-ui";
import { ItemType } from "@/core/data/item.ts";
import BasicTab from "./basic/basicTab";
import PricingTab from "./pricing/pricingTab";
import StorageTab from "./storage/storageTab";
import { itemsApi } from "./items.api";


const BASIC_FIELDS = ["name", "type"] as const;
const PRICING_FIELDS = ["sellUnitId", "uoMs"] as const;

export default function ChangeItemDialog({dto, onSuccess}: CommonChangeDialogProps<ItemDto>)
{
	useSignals();

	const {t} = useTranslation(["stocking", "common"]);
	const entity = useMemo(() => signal<Item>(dto ? Item.load(dto) : Item.create()), [dto]);
	const isLoading = useMemo(() => signal<boolean>(false), []);

	useEffect(() =>
	{
		const fetch = async () =>
		{
			isLoading.value = true;
			await Promise.all([
				Cubits.taxes.init(),
				Cubits.pricingMethods.init(),
				Cubits.units.init(),
				Cubits.stores.init(),
				Cubits.categories.init(),
				Cubits.brands.init()
			]);

			if (entity.value.mode.value === ChangeableEntityMode.Update && entity.value?.id)
			{
				const res = await itemsApi.get(entity.value.id.value);
				if (res.ok && res.data)
				{
					entity.value = Item.load(res.data);
				}
			}
			else if (entity.value.mode.value === ChangeableEntityMode.Create)
			{
				if (entity.value.itemTaxes.value.length === 0 && Cubits.taxes.entities.value.length > 0)
				{
					entity.value.changeTaxable(true, Cubits.taxes.entities);
				}
			}

			isLoading.value = false;
		};

		void fetch();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() =>
	{
		if (
			entity.value.mode.value === ChangeableEntityMode.Create &&
			entity.value.itemTaxes.value.length === 0 &&
			Cubits.taxes.entities.value.length > 0
		)
		{
			entity.value.changeTaxable(true, Cubits.taxes.entities);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [Cubits.taxes.entities.value]);

	const {commitFiles} = useStorageFile(
		() => entity.value.files.value,
		(v) => (entity.value.files.value = v),
		StorageType.Public
	);

	if (
		(entity.value.mode.value === ChangeableEntityMode.Create
			&& !Services.auth.hasAuth(SystemPermissionsResources.Items, SystemPermissionsActions.Add))
		|| (entity.value.mode.value === ChangeableEntityMode.Update
			&& !Services.auth.hasAuth(SystemPermissionsResources.Items, SystemPermissionsActions.Update))
	)
	{
		return <ChangeDialog.Unauthorized/>;
	}

	const basicHasError = BASIC_FIELDS.some((f) => entity.value.getError(f).value)
		|| entity.value.itemTaxes.value.some((t) => t.hasErrors)
		|| Boolean(entity.value.getError("files").value);
	const storageHasError = entity.value.itemStores.value.some((t) => t.hasErrors);
	const pricingHasError = PRICING_FIELDS.some((f) => entity.value.getError(f).value)
		|| entity.value.uoMs.value.some((t) => t.hasErrors);

	const transformDataBeforeSave = async (data: ItemDto): Promise<ItemDto> =>
	{
		data.files = await commitFiles(
			entity.value.files.value,
			"Items"
		);
		return data;
	};

	const title = entity.value.mode.value === ChangeableEntityMode.Create
		? t("items.addNewTitle")
		: `${ t("common:crudRow.edit") } ${ t("items.entityName") }`;

	if (isLoading.value)
	{
		return (
			<ChangeDialog>
				<ChangeDialog.Header title={ title }/>
				<Loading entityName={ t("items.entityName") }/>
			</ChangeDialog>
		);
	}

	return (
		<ChangeDialog className="sm:max-w-[80%] max-h-[94dvh] flex flex-col overflow-hidden">
			<ChangeDialog.Header title={ title }/>
			<ChangeDialog.Tabbed
				tabs={ [
					{
						label: t("items.basicInfo"),
						icon: Box,
						active: true,
						hasError: basicHasError,
						content: <BasicTab entity={ entity.value }/>
					},
					...(entity.value.type.value !== ItemType.Service
						? [{
							label: t("items.storage"),
							icon: Database,
							active: false,
							hasError: storageHasError,
							content: <StorageTab entity={ entity.value }/>
						}]
						: []),
					{
						label: t("items.pricing"),
						icon: DollarSign,
						active: false,
						hasError: pricingHasError,
						content: <PricingTab entity={ entity.value }/>
					}
				] }
			/>

			<ChangeDialog.Footer>
				<ChangeDialog.Close/>

				<ChangeDialog.SaveButton<Item, ItemDto>
					entity={ entity }
					resource={ itemsApi }
					transformData={ transformDataBeforeSave }
					onSuccess={ (data) => onSuccess?.(data, entity.value.mode.value) }
				/>
			</ChangeDialog.Footer>
		</ChangeDialog>
	);
}