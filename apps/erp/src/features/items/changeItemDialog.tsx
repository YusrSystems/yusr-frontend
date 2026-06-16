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

	const servicesIds = useMemo(() => signal<ServiceIds>(), []);
	const currentEntity = useMemo(() => signal<Item>(entity), []);
	useEffect(() =>
	{
		Cubits.taxes.init();
		Cubits.pricingMethods.init();
		Cubits.stores.init();
		Cubits.units.init();

		const fetch = async () =>
		{
			isLoading.value = true;
			const result = await Services.unitsApi.GetServiceIds();
			if (result.data)
			{
				servicesIds.value = result.data;
			}

			if (currentEntity.value.mode.value === "update" && currentEntity.value?.id)
			{
				const res = await service.Get(currentEntity.value.id.value);
				if (res.data != undefined)
				{
					currentEntity.value = Item.load(res.data.toJson());
				}
			}
			isLoading.value = false;
		};

		fetch();
	}, [currentEntity.value?.id.value]);
	const {t} = useTranslation(["stocking", "common"]);
	const isLoading = useMemo(() =>
	{
		return signal<boolean>(false);
	}, []);
	const {commitFiles} = useStorageFile(
		() => currentEntity.value.itemImages.value,
		(v) => (currentEntity.value.itemImages.value = v),
		StorageType.Public
	);

	if (
		(currentEntity.value.mode.value === "create"
			&& !Services.auth.hasAuth(SystemPermissionsResources.Units, SystemPermissionsActions.Add))
		|| (currentEntity.value.mode.value === "update"
			&& !Services.auth.hasAuth(SystemPermissionsResources.Units, SystemPermissionsActions.Update))
	)
	{
		return <ChangeDialog.Unauthorized/>;
	}

	const basicHasError = BASIC_FIELDS.some((f) => currentEntity.value.getError(f).value);
	const storageHasError = STORAGE_FIELDS.some((f) => currentEntity.value.getError(f).value);
	const pricingHasError = PRICING_FIELDS.some((f) => currentEntity.value.getError(f).value);

	const transformDataBeforeSave = async (): Promise<Item> =>
	{
		const resolvedFiles = await commitFiles(
			currentEntity.value.itemImages.value,
			`Items`
		);

		currentEntity.value.itemImages.value = resolvedFiles;

		return currentEntity.value;
	};

	const title = currentEntity.value.mode.value === "create"
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
