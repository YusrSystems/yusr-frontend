import type Item from "@/core/data/item";
import type ServiceIds from "@/core/data/serviceIds";
import type { Signal } from "@preact/signals-react";
import { signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import { Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
	ChangeableEntityMode,
	FieldsSection,
	FormField,
	SelectField,
	StorageFileField,
	StorageType,
	TextAreaField,
	TextField,
	useStorageFile
} from "yusr-ui";
import { ItemType } from "@/core/data/item.ts";
import TaxesSection from "./taxesSection";
import { ItemUoM } from "@/core/data/itemUoM.ts";
import { ItemPriceDto } from "@/core/data/itemPrice.ts";
import CategoriesMultiSearchableSelect from "@/core/components/searchableSelect/categoriesMultiSearchableSelect";
import BrandsSearchableSelect from "@/core/components/searchableSelect/brandsSearchableSelect";
import { useEffect, useMemo } from "react";


export default function BasicTab(
	{entity, serviceIds}: {
		entity: Item;
		serviceIds: Signal<ServiceIds | undefined>;
	}
)
{
	useSignals();
	const {t} = useTranslation("stocking");
	const {
		fileInputRef,
		handleFileChange,
		handleRemoveFile,
		handleDownload,
		showFilePreview,
		handleSetPrimary,
		getFileSrc
	} = useStorageFile(
		() => entity.itemImages.value,
		(v) => (entity.itemImages.value = v),
		StorageType.Public
	);

	const categoryIds = useMemo(() => signal<number[]>(entity.itemCategories.value.map(c => c.categoryId)), []);
	const categoryLabels = useMemo(() => signal<Record<number, string>>(
		Object.fromEntries(entity.itemCategories.value.map(c => [c.categoryId, c.categoryName]))
	), []);

	useEffect(() =>
	{
		entity.itemCategories.value = categoryIds.value.map(id => ({
			itemId: entity.id.value || 0,
			categoryId: id,
			categoryName: categoryLabels.value[id]
		} as any));
	}, [categoryIds.value]);

	return (
		<div className="space-y-6 animate-in fade-in">
			<div className="flex flex-col lg:flex-row gap-8">
				<div className="flex-1 space-y-4">
					<FieldsSection columns={ 2 }>
						<TextField
							label={ t("items.itemName") }
							required
							value={ entity.name }
							error={ entity.getError("name") }
						/>
						<SelectField<ItemType>
							label={ t("items.itemType") }
							required
							disabled={ entity.mode.value === ChangeableEntityMode.Update }
							value={ entity.type }
							onValueChange={ (type: ItemType) =>
							{
								const numericType = Number(type) as ItemType;
								entity.type.value = numericType;
								entity.itemStores.value = [];
								entity.quantity.value = 0;
								entity.minQuantity.value = 0;
								entity.maxQuantity.value = 0;
								entity.location.value = undefined;
								entity.sellUnitId.value = numericType === ItemType.Service ? serviceIds.value?.unitId : undefined;
								entity.sellUnitName.value = numericType === ItemType.Service ? t("items.service") : undefined;
								entity.uoMs.value = numericType === ItemType.Service
									? [ItemUoM.create({
										unitId: serviceIds.value?.unitId,
										unitName: t("items.service"),
										quantityMultiplier: 1,
										barcode: ItemUoM.generateBarcode(),
										prices: [
											{
												itemUoMId: 0,
												pricingMethodId: serviceIds.value?.pricingMethodId,
												pricingMethodName: t("items.service"),
												price: 0
											} as ItemPriceDto
										]
									})]
									: [ItemUoM.create({
										unitId: undefined,
										unitName: undefined,
										quantityMultiplier: 1,
										barcode: ItemUoM.generateBarcode()
									})];
							} }
							options={ [{label: t("items.product"), value: ItemType.Product}, {
								label: t("items.service"),
								value: ItemType.Service
							}] }
						/>

						<FormField label={ t("items.category", "التصنيف") }>
							<CategoriesMultiSearchableSelect ids={ categoryIds } labels={ categoryLabels }/>
						</FormField>

						<FormField label={ t("items.brand", "العلامة التجارية") }>
							<BrandsSearchableSelect id={ entity.brandId } label={ entity.brandName }/>
						</FormField>

						<SelectField
							label={ t("items.status") }
							required
							value={ entity.statusId }
							options={ [{label: t("items.active"), value: 1}, {label: t("items.inactive"), value: 0}] }
						/>
					</FieldsSection>

					<TextAreaField
						label={ t("items.description") }
						value={ entity.description }
						rows={ 2 }
					/>

					<TextAreaField
						label={ t("items.notes") }
						value={ entity.notes }
						rows={ 2 }
					/>
				</div>

				<div className="w-full lg:w-108 shrink-0 bg-muted/10 p-4 rounded-lg border">
					<StorageFileField
						label={ t("items.itemImages") }
						file={ entity.itemImages.value }
						fileInputRef={ fileInputRef }
						onFileChange={ handleFileChange }
						onRemove={ handleRemoveFile }
						onDownload={ handleDownload }
						getFileSrc={ getFileSrc }
						showPreview={ showFilePreview }
						extraActions={ [{
							icon: <Star className="h-4 w-4"/>,
							label: "Mark as Primary",
							className: "bg-yellow-500 text-white",
							onClick: (index) => handleSetPrimary(index)
						}] }

						error={ entity.getError("itemImages") }
					/>
				</div>
			</div>

			<TaxesSection entity={ entity }/>
		</div>
	);
}