import type { Signal } from "@preact/signals-react";
import { ChangeableEntity, type ChangeableEntityMode, Dto, Entity, i18n, type StorageFile, Validators } from "yusr-ui";

export const ItemType = {
  Product: 1,
  Service: 2
};
export type ItemType = (typeof ItemType)[keyof typeof ItemType];

export class ItemUnitPricingMethodDto extends Dto
{
  public itemId!: number;
  public unitId!: number;
  public itemUnitPricingMethodName!: string;
  public unitName?: string;
  public pricingMethodId!: number;
  public pricingMethodName?: string;
  public quantityMultiplier!: number;
  public unitPrice!: number;
  public price!: number;
  public barcode?: string;
}

export class ItemUnitPricingMethod extends Entity<ItemUnitPricingMethodDto>
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
}

export class ItemTaxDto extends Dto
{
  public itemId!: number;
  public taxId!: number;
  public taxName?: string;
  public taxPercentage!: number;
}

export class ItemTax extends Entity<ItemTaxDto>
{
  declare itemId: Signal<number>;
  declare taxId: Signal<number>;
  declare taxName: Signal<string | undefined>;
  declare taxPercentage: Signal<number | undefined>;
}

export class ItemStoreDto extends Dto
{
  public itemId!: number;
  public storeId!: number;
  public storeName?: string;
  public initialQuantity!: number;
  public quantity!: number;
}

export class ItemStore extends Entity<ItemStoreDto>
{
  declare itemId: Signal<number>;
  declare storeId: Signal<number>;
  declare storeName: Signal<string | undefined>;
  declare initialQuantity: Signal<number>;
  declare quantity: Signal<number>;
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
      validators: [
        Validators.arrayMinLength(1, i18n.t("stocking:items.pricingMethodsRequired")),
        Validators.custom(
          (methods: ItemUnitPricingMethodDto[]) =>
          {
            if (!methods || methods.length === 0)
            {
              return true;
            }

            for (let i = 0; i < methods.length; i++)
            {
              const m = methods[i];
              if (!m.unitId)
              {
                return false;
              }
              if (!m.pricingMethodId)
              {
                return false;
              }

              if (m.quantityMultiplier == undefined || m.quantityMultiplier <= 0)
              {
                return false;
              }
              if (m.price == undefined || m.price < 0)
              {
                return false;
              }
            }
            return true;
          },
          i18n.t("stocking:items.pricingMethodsValidationError")
        )
      ]
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

          for (let i = 0; i < stores.length; i++)
          {
            const s = stores[i];
            if (!s.storeId || s.initialQuantity == undefined || s.initialQuantity < 0)
            {
              return false;
            }
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

export function generateBarcode(length = 12)
{
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from(
    { length },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join("");
}
