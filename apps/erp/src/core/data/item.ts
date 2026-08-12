import { type Signal } from "@preact/signals-react";
import { ChangeableEntity, ChangeableEntityMode, Dto, i18n, type StorageFile, Validators } from "yusr-ui";
import { ItemStore, type ItemStoreDto } from "./itemStore";
import { ItemTax, ItemTaxDto } from "./itemTax";
import { TaxDto } from "@/core/data/tax.ts";
import { ItemUoM, type ItemUoMDto } from "@/core/data/itemUoM.ts";


export const ItemType = {
	Product: 1,
	Service: 2
};
export type ItemType = (typeof ItemType)[keyof typeof ItemType];

export class ItemCategoryDto extends Dto
{
	public itemId!: number;
	public categoryId!: number;
	public categoryName!: string;
}

export class ItemDto extends Dto
{
	public type!: ItemType;
	public name!: string;
	public description?: string;
	public brandId?: number;
	public brandName?: string;
	public sellUnitId!: number;
	public sellUnitName?: string;
	public minQuantity?: number;
	public maxQuantity?: number;
	public quantity!: number;
	public storeQuantity!: number;
	public lastBuyPrice!: number;
	public taxIncluded!: boolean;
	public taxable!: boolean;
	public exemptionReasonCode?: string;
	public exemptionReason?: string;
	public statusId!: number;
	public location?: string;
	public notes?: string;
	public totalTaxes!: number;
	public createdAt!: string | Date;
	public createdBy!: number;
	public updatedAt!: string | Date;
	public updatedBy!: number;
	public rowVer!: number;

	public itemCategories: ItemCategoryDto[] = [];
	public uoMs: ItemUoMDto[] = [];
	public itemTaxes: ItemTaxDto[] = [];
	public itemStores: ItemStoreDto[] = [];
	public itemImages: StorageFile[] = [];
}

export default class Item extends ChangeableEntity<ItemDto>
{
	public type: Signal<ItemType>;
	public name: Signal<string>;
	public description: Signal<string | undefined>;
	public brandId: Signal<number | undefined>;
	public brandName: Signal<string | undefined>;
	public sellUnitId: Signal<number | undefined>;
	public sellUnitName: Signal<string | undefined>;
	public minQuantity: Signal<number | undefined>;
	public maxQuantity: Signal<number | undefined>;
	public quantity: Signal<number>;
	public storeQuantity: Signal<number>;
	public lastBuyPrice: Signal<number>;
	public taxIncluded: Signal<boolean>;
	public taxable: Signal<boolean>;
	public exemptionReasonCode: Signal<string | undefined>;
	public exemptionReason: Signal<string | undefined>;
	public statusId: Signal<number>;
	public location: Signal<string | undefined>;
	public notes: Signal<string | undefined>;
	public totalTaxes: Signal<number>;
	public createdAt: Signal<string | Date | undefined>;
	public createdBy: Signal<number | undefined>;
	public updatedAt: Signal<string | Date | undefined>;
	public updatedBy: Signal<number | undefined>;
	public rowVer: Signal<number | undefined>;

	public itemCategories: Signal<ItemCategoryDto[]>;
	public uoMs: Signal<ItemUoM[]>;
	public itemTaxes: Signal<ItemTax[]>;
	public itemStores: Signal<ItemStore[]>;
	public itemImages: Signal<StorageFile[]>;

	constructor(dto: Partial<ItemDto> | undefined, mode: ChangeableEntityMode = ChangeableEntityMode.Create)
	{
		super(dto, [
			{
				field: "name",
				selector: (d) => d.name,
				validators: [Validators.required(i18n.t("stocking:items.nameRequired"))]
			},
			{
				field: "type",
				selector: (d) => d.type,
				validators: [Validators.required(i18n.t("stocking:items.typeRequired"))]
			},
			{
				field: "uoMs",
				selector: (d) => d.uoMs,
				validators: [
					Validators.arrayMinLength(1, i18n.t("stocking:items.pricingMethodsRequired")),
					Validators.custom((val: ItemUoMDto[]) =>
					{
						const barcodes = val.map(u => u.barcode?.trim()).filter(Boolean);
						return new Set(barcodes).size === barcodes.length;
					}, i18n.t("stocking:items.duplicateBarcodeError", "لا يمكن تكرار نفس الباركود بين الوحدات المختلفة"))
				]
			},
			{
				field: "sellUnitId",
				selector: (d) => d.sellUnitId,
				validators: [Validators.custom(
					(val, form) => form.type === ItemType.Service || !!val,
					i18n.t("stocking:items.baseUnitRequired")
				)]
			},
			{
				field: "itemImages",
				selector: (d) => d.itemImages,
				validators: [Validators.arrayMaxLength(5)]
			}
		], mode);

		this.type = this.assign("type", dto?.type ?? 1);
		this.name = this.assign("name", dto?.name ?? "");
		this.description = this.assign("description", dto?.description ?? "");
		this.brandId = this.assign("brandId", dto?.brandId);
		this.brandName = this.assign("brandName", dto?.brandName ?? "");
		this.sellUnitId = this.assign("sellUnitId", dto?.sellUnitId ?? 0);
		this.sellUnitName = this.assign("sellUnitName", dto?.sellUnitName ?? "");
		this.minQuantity = this.assign("minQuantity", dto?.minQuantity ?? 0);
		this.maxQuantity = this.assign("maxQuantity", dto?.maxQuantity ?? 0);
		this.quantity = this.assign("quantity", dto?.quantity ?? 0);
		this.storeQuantity = this.assign("storeQuantity", dto?.storeQuantity ?? 0);
		this.lastBuyPrice = this.assign("lastBuyPrice", dto?.lastBuyPrice ?? 0);
		this.taxIncluded = this.assign("taxIncluded", dto?.taxIncluded ?? false);
		this.taxable = this.assign("taxable", dto?.taxable ?? true);
		this.exemptionReasonCode = this.assign("exemptionReasonCode", dto?.exemptionReasonCode ?? "");
		this.exemptionReason = this.assign("exemptionReason", dto?.exemptionReason ?? "");
		this.statusId = this.assign("statusId", dto?.statusId ?? 1);
		this.location = this.assign("location", dto?.location ?? "");
		this.notes = this.assign("notes", dto?.notes ?? "");
		this.totalTaxes = this.assign("totalTaxes", dto?.totalTaxes ?? 0);
		this.createdAt = this.assign("createdAt", dto?.createdAt);
		this.createdBy = this.assign("createdBy", dto?.createdBy);
		this.updatedAt = this.assign("updatedAt", dto?.updatedAt);
		this.updatedBy = this.assign("updatedBy", dto?.updatedBy);
		this.rowVer = this.assign("rowVer", dto?.rowVer);

		this.itemCategories = this.assign("itemCategories", dto?.itemCategories ?? []);
		this.uoMs = this.assign("uoMs", (dto?.uoMs ?? [ItemUoM.create({
			unitId: undefined,
			unitName: undefined,
			quantityMultiplier: 1,
			barcode: ItemUoM.generateBarcode()
		}).toJson()]).map(m => new ItemUoM(m)));
		this.itemTaxes = this.assign("itemTaxes", (dto?.itemTaxes ?? []).map(t => new ItemTax(t)));
		this.itemStores = this.assign("itemStores", (dto?.itemStores ?? []).map(s => new ItemStore(s)));
		this.itemImages = this.assign("itemImages", dto?.itemImages ?? []);

		const checkChildren = () =>
		{
			this.hasChanges.value = this.uoMs.value.some((m) => m.hasChanges.value)
				|| this.itemTaxes.value.some((t) => t.hasChanges.value)
				|| this.itemStores.value.some((s) => s.hasChanges.value);
		};
		this.itemTaxes.value.forEach((t) => t.hasChanges.subscribe(checkChildren));
		this.itemStores.value.forEach((s) => s.hasChanges.subscribe(checkChildren));
		this.uoMs.value.forEach((m) => m.hasChanges.subscribe(checkChildren));
	}

	override validate(dto?: Partial<ItemDto>): boolean
	{
		const itemResult = super.validate(dto);
		const taxesResult = this.itemTaxes.value.every((t) => t.validate());
		const uoMsResult = this.uoMs.value.every((m) => m.validate());
		const storesResult = this.type.value === ItemType.Service ? true : this.itemStores.value.every((s) => s.validate());
		return itemResult && taxesResult && uoMsResult && storesResult;
	}

	public changeTaxable(isTaxable: boolean, taxes: Signal<TaxDto[]>)
	{
		if (isTaxable)
		{
			this.itemTaxes.value = taxes.value.filter((t) => t.isPrimary)
				.map((t) => new ItemTax({
					id: 0,
					itemId: this.id.value,
					taxId: t.id,
					taxName: t.name,
					taxPercentage: t.percentage
				}));
			this.exemptionReason.value = "";
			this.exemptionReasonCode.value = "";
		}
		else
		{
			this.itemTaxes.value = [];
		}
	}
}

export class BarcodeResult
{
	public item!: ItemDto;
	public selectedUoMId?: number;
	public selectedPricingMethodId?: number;
}