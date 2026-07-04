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

export default function ChangeItemDialog({dto, service, onSuccess}: CommonChangeDialogProps<ItemDto>)
{
	useSignals();

	const {t} = useTranslation(["stocking", "common"]);
	const servicesIds = useMemo(() => signal<ServiceIds>(), []);
	const entity = useMemo(() => signal<Item>(dto ? Item.load(dto) : Item.create()), []);
	const isLoading = useMemo(() => signal<boolean>(false), []);

	useEffect(() =>
	{
		const fetch = async () =>
		{
			isLoading.value = true;

			Cubits.taxes.init();
			Cubits.pricingMethods.init();

			const result = await Services.unitsApi.GetServiceIds();
			if (result.data)
			{
				servicesIds.value = result.data;
			}

			if (entity.value.mode.value === ChangeableEntityMode.Update && entity.value?.id)
			{
				const res = await service.Get(entity.value.id.value);
				if (res.data != undefined)
				{
					entity.value = Item.load(res.data);
				}
			}

			isLoading.value = false;
		};

		void fetch();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []); // I left the deps array empty, it causes infinite rerenders if you put anything inside it

	useEffect(() =>
	{
		if (entity.value.mode.value === ChangeableEntityMode.Create && !entity.value.isDirty.value && Cubits.taxes.entities.value.length > 0)
		{
			entity.value.changeTaxable(true, Cubits.taxes.entities);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [Cubits.taxes.entities.value]); // I left the deps array like this, it causes infinite rerenders if you put anything inside it

	const {commitFiles} = useStorageFile(
		() => entity.value.itemImages.value,
		(v) => (entity.value.itemImages.value = v),
		StorageType.Public
	);

	if (
		(entity.value.mode.value === ChangeableEntityMode.Create
			&& !Services.auth.hasAuth(SystemPermissionsResources.Units, SystemPermissionsActions.Add))
		|| (entity.value.mode.value === ChangeableEntityMode.Update
			&& !Services.auth.hasAuth(SystemPermissionsResources.Units, SystemPermissionsActions.Update))
	)
	{
		return <ChangeDialog.Unauthorized/>;
	}

	const basicHasError = BASIC_FIELDS.some((f) => entity.value.getError(f).value)
		|| entity.value.itemTaxes.value.some((t) => t.hasErrors);
	const storageHasError = STORAGE_FIELDS.some((f) => entity.value.getError(f).value)
		|| entity.value.itemStores.value.some((t) => t.hasErrors);
	const pricingHasError = PRICING_FIELDS.some((f) => entity.value.getError(f).value)
		|| entity.value.itemUnitPricingMethods.value.some((t) => t.hasErrors);

	const transformDataBeforeSave = async (): Promise<ItemDto> =>
	{
		entity.value.itemImages.value = await commitFiles(
			entity.value.itemImages.value,
			`Items`
		);

		return entity.value.toJson();
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
		<ChangeDialog className="sm:max-w-[80%]">
			<ChangeDialog.Header title={ title }/>
			<ChangeDialog.Tabbed
				tabs={ [
					{
						label: t("items.basicInfo"),
						icon: Box,
						active: true,
						hasError: basicHasError,
						content: <BasicTab entity={ entity.value } serviceIds={ servicesIds }/>
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
					service={ service }
					onSuccess={ (data) => onSuccess?.(data, entity.value.mode.value) }
					transformData={ transformDataBeforeSave }
				/>
			</ChangeDialog.Footer>
		</ChangeDialog>
	);
}
