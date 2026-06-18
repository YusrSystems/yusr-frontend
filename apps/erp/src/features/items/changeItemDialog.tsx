import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources";
import type { ItemDto } from "@/core/data/item";
import Item from "@/core/data/item";
import type ServiceIds from "@/core/data/serviceIds";
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


const BASIC_FIELDS = ["name", "type"] as const;
const STORAGE_FIELDS = ["itemStores"] as const;
const PRICING_FIELDS = ["sellUnitId", "initialCost", "itemUnitPricingMethods"] as const;

export default function ChangeItemDialog({entity, service, onSuccess}: CommonChangeDialogProps<Item, ItemDto>)
{
	useSignals();

	const {t} = useTranslation(["stocking", "common"]);
	const servicesIds = useMemo(() => signal<ServiceIds>(), []);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const currentEntity = useMemo(() => signal<Item>(entity), []); // I left the deps array empty, it causes infinite rerenders if you put anything inside it
	const isLoading = useMemo(() => signal<boolean>(false), []);

	useEffect(() =>
	{
		const fetch = async () =>
		{
			isLoading.value = true;

			Cubits.taxes.init();
			Cubits.pricingMethods.init();
			Cubits.stores.init();
			Cubits.units.init();

			const result = await Services.unitsApi.GetServiceIds();
			if (result.data)
			{
				servicesIds.value = result.data;
			}

			if (currentEntity.value.mode.value === ChangeableEntityMode.Update && currentEntity.value?.id)
			{
				const res = await service.Get(currentEntity.value.id.value);
				if (res.data != undefined)
				{
					currentEntity.value = Item.load(res.data.toJson());
				}
			}

			isLoading.value = false;
		};

		void fetch();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []); // I left the deps array empty, it causes infinite rerenders if you put anything inside it

	useEffect(() =>
	{
		if (currentEntity.value.mode.value === ChangeableEntityMode.Create && !entity.isDirty.value && Cubits.taxes.entities.value.length > 0)
		{
			entity.changeTaxable(true, Cubits.taxes.entities);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [Cubits.taxes.entities.value]); // I left the deps array like this, it causes infinite rerenders if you put anything inside it

	const {commitFiles} = useStorageFile(
		() => currentEntity.value.itemImages.value,
		(v) => (currentEntity.value.itemImages.value = v),
		StorageType.Public
	);

	if (
		(currentEntity.value.mode.value === ChangeableEntityMode.Create
			&& !Services.auth.hasAuth(SystemPermissionsResources.Units, SystemPermissionsActions.Add))
		|| (currentEntity.value.mode.value === ChangeableEntityMode.Update
			&& !Services.auth.hasAuth(SystemPermissionsResources.Units, SystemPermissionsActions.Update))
	)
	{
		return <ChangeDialog.Unauthorized/>;
	}

	const basicHasError = BASIC_FIELDS.some((f) => currentEntity.value.getError(f).value)
		|| currentEntity.value.itemTaxes.value.some((t) => t.hasErrors);
	const storageHasError = STORAGE_FIELDS.some((f) => currentEntity.value.getError(f).value)
		|| currentEntity.value.itemStores.value.some((t) => t.hasErrors);
	const pricingHasError = PRICING_FIELDS.some((f) => currentEntity.value.getError(f).value)
		|| currentEntity.value.itemUnitPricingMethods.value.some((t) => t.hasErrors);

	const transformDataBeforeSave = async (): Promise<Item> =>
	{
		currentEntity.value.itemImages.value = await commitFiles(
			currentEntity.value.itemImages.value,
			`Items`
		);

		return currentEntity.value;
	};

	const title = currentEntity.value.mode.value === ChangeableEntityMode.Create
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
		<ChangeDialog className="sm:max-w-[80%]">
			<ChangeDialog.Header title={ title }/>
			<ChangeDialog.Tabbed
				tabs={ [
					{
						label: t("items.basicInfo"),
						icon: Box,
						active: true,
						hasError: basicHasError,
						content: <BasicTab entity={ currentEntity.value } serviceIds={ servicesIds }/>
					},
					...(currentEntity.value.type.value !== ItemType.Service
						? [{
							label: t("items.storage"),
							icon: Database,
							active: false,
							hasError: storageHasError,
							content: <StorageTab entity={ currentEntity.value }/>
						}]
						: []),
					{
						label: t("items.pricing"),
						icon: DollarSign,
						active: false,
						hasError: pricingHasError,
						content: <PricingTab entity={ currentEntity.value }/>
					}
				] }
			/>

			<ChangeDialog.Footer>
				<ChangeDialog.Close/>

				<ChangeDialog.SaveButton<Item, ItemDto>
					entity={ currentEntity.value }
					service={ service }
					onSuccess={ (data) => onSuccess?.(data) }
					transformData={ transformDataBeforeSave }
				/>
			</ChangeDialog.Footer>
		</ChangeDialog>
	);
}
