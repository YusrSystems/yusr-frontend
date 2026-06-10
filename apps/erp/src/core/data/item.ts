import type { Signal } from "@preact/signals-react";
import { ChangeableEntity, type ChangeableEntityMode, Dto, i18n, type StorageFile, ValidatableEntity, Validators } from "yusr-ui";

export const ItemType = {
  Product: 1,
  Service: 2
};
export type ItemType = (typeof ItemType)[keyof typeof ItemType];

export class ItemUnitPricingMethodDto extends Dto
{
  public itemId!: number;
  public unitId!: number | undefined;
  public itemUnitPricingMethodName!: string | undefined;
  public unitName?: string;
  public pricingMethodId!: number | undefined;
  public pricingMethodName?: string;
  public quantityMultiplier!: number;
  public unitPrice!: number;
  public price!: number;
  public barcode?: string;
}

export class ItemUnitPricingMethod extends ValidatableEntity<ItemUnitPricingMethodDto>
{
  declare itemId: Signal<number>;
  declare unitId: Signal<number>;
  declare itemUnitPricingMethodName: Signal<string>;
  declare unitName: Signal<string | undefined>;
  declare pricingMethodId: Signal<number>;
  declare pricingMethodName: Signal<string | undefined>;
  declare quantityMultiplier: Signal<number>;
  declare unitPrice: Signal<number>;
  declare price: Signal<number>;
  declare barcode: Signal<string | undefined>;

  constructor(dto: ItemUnitPricingMethodDto)
  {
    super(dto, [{
      field: "unitId",
      selector: (d) => d.unitId,
      validators: [Validators.required(i18n.t("stocking:items.unitRequired"))]
    }, {
      field: "pricingMethodId",
      selector: (d) => d.pricingMethodId,
      validators: [Validators.required(i18n.t("stocking:items.pricingMethodRequired"))]
    }, {
      field: "quantityMultiplier",
      selector: (d) => d.quantityMultiplier,
      validators: [Validators.min(1, i18n.t("stocking:items.quantityMultiplierMin"))]
    }, {
      field: "unitPrice",
      selector: (d) => d.unitPrice,
      validators: [Validators.min(0, i18n.t("stocking:items.unitPriceMin"))]
    }, {
      field: "itemUnitPricingMethodName",
      selector: (d) => d.itemUnitPricingMethodName,
      validators: [Validators.required(i18n.t("stocking:items.itemUnitPricingMethodNameRequired"))]
    }]);
  }

  generateBarcode(length = 12): void
  {
    this.barcode.value = ItemUnitPricingMethod.generateBarcode(length);
  }

  static generateBarcode(length = 12)
  {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    return Array.from(
      { length },
      () => chars[Math.floor(Math.random() * chars.length)]
    ).join("");
  }
}

export class ItemTaxDto extends Dto
{
  public itemId!: number;
  public taxId!: number | undefined;
  public taxName?: string;
  public taxPercentage!: number;
}

export class ItemTax extends ValidatableEntity<ItemTaxDto>
{
  declare itemId: Signal<number>;
  declare taxId: Signal<number>;
  declare taxName: Signal<string | undefined>;
  declare taxPercentage: Signal<number | undefined>;

  constructor(dto: ItemTaxDto)
  {
    super(dto, [{
      field: "taxId",
      selector: (d) => d.taxId,
      validators: [Validators.required(i18n.t("stocking:items.taxRequired"))]
    }]);
  }
}

export class ItemStoreDto extends Dto
{
  public itemId!: number;
  public storeId!: number | undefined;
  public storeName?: string;
  public initialQuantity!: number;
  public quantity!: number;
}

export class ItemStore extends ValidatableEntity<ItemStoreDto>
{
  declare itemId: Signal<number>;
  declare storeId: Signal<number>;
  declare storeName: Signal<string | undefined>;
  declare initialQuantity: Signal<number>;
  declare quantity: Signal<number>;

  constructor(dto: ItemStoreDto)
  {
    super(dto, [{
      field: "storeId",
      selector: (d) => d.storeId,
      validators: [Validators.required(i18n.t("stocking:items.storeRequired"))]
    }, {
      field: "initialQuantity",
      selector: (d) => d.initialQuantity,
      validators: [Validators.min(0, i18n.t("stocking:items.initialQuantityMin"))]
    }]);
  }
}

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
  declare type: Signal<ItemType>;
  declare name: Signal<string>;
  declare description: Signal<string | undefined>;
  declare class: Signal<string | undefined>;
  declare brand: Signal<string | undefined>;
  declare sellUnitId: Signal<number | undefined>;
  declare sellUnitName: Signal<string | undefined>;
  declare minQuantity: Signal<number | undefined>;
  declare maxQuantity: Signal<number | undefined>;
  declare initialQuantity: Signal<number>;
  declare quantity: Signal<number>;
  declare storeQuantity: Signal<number>;
  declare lastBuyPrice: Signal<number>;
  declare initialCost: Signal<number>;
  declare cost: Signal<number>;
  declare taxIncluded: Signal<boolean>;
  declare taxable: Signal<boolean>;
  declare exemptionReasonCode: Signal<string | undefined>;
  declare exemptionReason: Signal<string | undefined>;
  declare statusId: Signal<number>;
  declare location: Signal<string | undefined>;
  declare notes: Signal<string | undefined>;
  declare totalTaxes: Signal<number>;
  declare itemUnitPricingMethods: Signal<ItemUnitPricingMethod[]>;
  declare itemTaxes: Signal<ItemTax[]>;
  declare itemStores: Signal<ItemStore[]>;
  declare itemImages: Signal<StorageFile[]>;

  protected initialValue(dto?: Partial<ItemDto> | undefined): ItemDto
  {
    return {
      id: 0,
      type: ItemType.Product,
      name: "",
      description: "",
      class: "",
      brand: "",
      sellUnitId: 0,
      sellUnitName: "",
      minQuantity: 0,
      maxQuantity: 0,
      initialQuantity: 0,
      quantity: 0,
      storeQuantity: 0,
      lastBuyPrice: 0,
      initialCost: 0,
      cost: 0,
      taxIncluded: false,
      taxable: false,
      exemptionReasonCode: "",
      exemptionReason: "",
      statusId: 1,
      location: "",
      notes: "",
      totalTaxes: 0,
      itemUnitPricingMethods: [],
      itemTaxes: [],
      itemStores: [],
      itemImages: [],
      ...dto
    };
  }

  constructor(dto: ItemDto, mode: ChangeableEntityMode = "create")
  {
    super({
      ...dto,
      itemTaxes: (dto.itemTaxes ?? []).map((t) => t instanceof ItemTax ? t : new ItemTax(t)),
      itemStores: (dto.itemStores ?? []).map((s) => s instanceof ItemStore ? s : new ItemStore(s)),
      itemUnitPricingMethods: (dto.itemUnitPricingMethods ?? []).map((m) =>
        m instanceof ItemUnitPricingMethod ? m : new ItemUnitPricingMethod(m)
      )
    }, [{
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

export class BarcodeResult
{
  public item!: ItemDto;
  public selectedIupm!: ItemUnitPricingMethod;

  constructor(init?: Partial<BarcodeResult>)
  {
    Object.assign(this, init);
  }
}
