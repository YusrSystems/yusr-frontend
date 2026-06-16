import { type Signal } from "@preact/signals-react";
import { ChangeableEntity, type ChangeableEntityMode, Dto, i18n, type StorageFile, Validators } from "yusr-ui";
import { ItemStore, type ItemStoreDto } from "./itemStore";
import { ItemTax } from "./itemTax";
import { ItemUnitPricingMethod, ItemUnitPricingMethodDto } from "./itemUnitPricingMethod";


export const ItemType = {
	Product: 1,
	Service: 2
};
export type ItemType = (typeof ItemType)[keyof typeof ItemType];

export class ItemDto extends Dto
{
	public type!: ItemType;
	public name!: string;
	public description?: string;
	public class?: string;
	public brand?: string;
	public sellUnitId!: number;
	public sellUnitName?: string;
	public minQuantity?: number;
	public maxQuantity?: number;
	public initialQuantity!: number;
	public quantity!: number;
	public storeQuantity!: number;
	public lastBuyPrice!: number;
	public initialCost!: number;
	public cost!: number;
	public taxIncluded!: boolean;
	public taxable!: boolean;
	public exemptionReasonCode?: string;
	public exemptionReason?: string;
	public statusId!: number;
	public location?: string;
	public notes?: string;
	public totalTaxes!: number;
	public itemUnitPricingMethods: ItemUnitPricingMethod[] = [];
	public itemTaxes: ItemTax[] = [];
	public itemStores: ItemStore[] = [];
	public itemImages: StorageFile[] = [];
}

export default class Item extends ChangeableEntity<ItemDto>
{
	public type: Signal<ItemType>;
	public name: Signal<string>;
	public description: Signal<string | undefined>;
	public class: Signal<string | undefined>;
	public brand: Signal<string | undefined>;
	public sellUnitId: Signal<number | undefined>;
	public sellUnitName: Signal<string | undefined>;
	public minQuantity: Signal<number | undefined>;
	public maxQuantity: Signal<number | undefined>;
	public initialQuantity: Signal<number>;
	public quantity: Signal<number>;
	public storeQuantity: Signal<number>;
	public lastBuyPrice: Signal<number>;
	public initialCost: Signal<number>;
	public cost: Signal<number>;
	public taxIncluded: Signal<boolean>;
	public taxable: Signal<boolean>;
	public exemptionReasonCode: Signal<string | undefined>;
	public exemptionReason: Signal<string | undefined>;
	public statusId: Signal<number>;
	public location: Signal<string | undefined>;
	public notes: Signal<string | undefined>;
	public totalTaxes: Signal<number>;
	public itemUnitPricingMethods: Signal<ItemUnitPricingMethod[]>;
	public itemTaxes: Signal<ItemTax[]>;
	public itemStores: Signal<ItemStore[]>;
	public itemImages: Signal<StorageFile[]>;

	constructor(dto: Partial<ItemDto> | undefined, mode: ChangeableEntityMode = "create")
	{
		super(dto, [{
			field: "name",
			selector: (d) => d.name,
			validators: [Validators.required(i18n.t("stocking:items.nameRequired"))]
		}, {
			field: "type",
			selector: (d) => d.type,
			validators: [Validators.required(i18n.t("stocking:items.typeRequired"))]
		}, {
			field: "itemUnitPricingMethods",
			selector: (d) => d.itemUnitPricingMethods,
			validators: [Validators.arrayMinLength(1, i18n.t("stocking:items.pricingMethodsRequired"))]
		}, {
			field: "itemStores",
			selector: (d) => d.itemStores,
			validators: [Validators.custom(
				(stores: ItemStoreDto[], form: ItemDto) =>
				{
					if (form.type === ItemType.Service)
					{
						return true;
					}

					if (stores.length <= 0)
					{
						return false;
					}

					return true;
				},
				i18n.t("stocking:items.storesValidationError")
			)]
		}, {
			field: "sellUnitId",
			selector: (d) => d.sellUnitId,
			validators: [Validators.custom(
				(val, form) => form.type === ItemType.Service || !!val,
				i18n.t("stocking:items.baseUnitRequired")
			)]
		}, {
			field: "initialCost",
			selector: (d) => d.initialCost,
			validators: [Validators.required(i18n.t("stocking:items.initialCostRequired"))]
		}], mode);

		this.type = this.assign("type", dto?.type ?? 1);
		this.name = this.assign("name", dto?.name ?? "");
		this.description = this.assign("description", dto?.description ?? "");
		this.class = this.assign("class", dto?.class ?? "");
		this.brand = this.assign("brand", dto?.brand ?? "");
		this.sellUnitId = this.assign("sellUnitId", dto?.sellUnitId ?? 0);
		this.sellUnitName = this.assign("sellUnitName", dto?.sellUnitName ?? "");
		this.minQuantity = this.assign("minQuantity", dto?.minQuantity ?? 0);
		this.maxQuantity = this.assign("maxQuantity", dto?.maxQuantity ?? 0);
		this.initialQuantity = this.assign("initialQuantity", dto?.initialQuantity ?? 0);
		this.quantity = this.assign("quantity", dto?.quantity ?? 0);
		this.storeQuantity = this.assign("storeQuantity", dto?.storeQuantity ?? 0);
		this.lastBuyPrice = this.assign("lastBuyPrice", dto?.lastBuyPrice ?? 0);
		this.initialCost = this.assign("initialCost", dto?.initialCost ?? 0);
		this.cost = this.assign("cost", dto?.cost ?? 0);
		this.taxIncluded = this.assign("taxIncluded", dto?.taxIncluded ?? false);
		this.taxable = this.assign("taxable", dto?.taxable ?? false);
		this.exemptionReasonCode = this.assign("exemptionReasonCode", dto?.exemptionReasonCode ?? "");
		this.exemptionReason = this.assign("exemptionReason", dto?.exemptionReason ?? "");
		this.statusId = this.assign("statusId", dto?.statusId ?? 0);
		this.location = this.assign("location", dto?.location ?? "");
		this.notes = this.assign("notes", dto?.notes ?? "");
		this.totalTaxes = this.assign("totalTaxes", dto?.totalTaxes ?? 0);
		const itemUnitPricingMethodsSignalArray = (dto?.itemUnitPricingMethods ?? []).map((m) =>
			m instanceof ItemUnitPricingMethod ? m : new ItemUnitPricingMethod(m)
		);
		this.itemUnitPricingMethods = this.assign("itemUnitPricingMethods", itemUnitPricingMethodsSignalArray);
		const itemTaxesSignalArray = (dto?.itemTaxes ?? []).map((t) => t instanceof ItemTax ? t : new ItemTax(t));
		this.itemTaxes = this.assign("itemTaxes", itemTaxesSignalArray);
		const itemStoresSignalArray = (dto?.itemStores ?? []).map((s) => s instanceof ItemStore ? s : new ItemStore(s));
		this.itemStores = this.assign("itemStores", itemStoresSignalArray);
		this.itemImages = this.assign("itemImages", dto?.itemImages ?? []);

		const checkChildren = () =>
		{
			this.hasChanges.value = this.itemUnitPricingMethods.value.some((m) => m.hasChanges.value)
				|| this.itemTaxes.value.some((t) => t.hasChanges.value)
				|| this.itemStores.value.some((s) => s.hasChanges.value);
		};
		this.itemTaxes.value.forEach((t) => t.hasChanges.subscribe(checkChildren));
		this.itemStores.value.forEach((s) => s.hasChanges.subscribe(checkChildren));
		this.itemUnitPricingMethods.value.forEach((m) => m.hasChanges.subscribe(checkChildren));
	}

	override validate(dto?: Partial<ItemDto>): boolean
	{
		const itemResult = super.validate(dto);
		const taxesResult = this.itemTaxes.value.every((t) => t.validate());
		const iupmResult = this.itemUnitPricingMethods.value.every((m) => m.validate());
		const storesResult = this.itemStores.value.every((s) => s.validate());
		return itemResult && taxesResult && iupmResult && storesResult;
	}
}

export class BarcodeResultDto
{
	public item!: ItemDto;
	public selectedIupm!: ItemUnitPricingMethodDto;
}

export class BarcodeResult
{
	public item!: Item;
	public selectedIupm!: ItemUnitPricingMethod;
}
