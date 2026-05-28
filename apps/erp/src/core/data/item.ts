import { type TFunction } from "i18next";
import { BaseEntity, type ColumnName, createGenericDialogSlice, createGenericEntitySlice, createGenericFormSlice, type StorageFile, type ValidationRule, Validators } from "yusr-ui";
import ItemsApiService from "../networking/itemApiService";

export const ItemType = {
  Product: 1,
  Service: 2
};
export type ItemType = (typeof ItemType)[keyof typeof ItemType];

export class ItemUnitPricingMethod extends BaseEntity
{
  public itemId!: number;
  public unitId!: number;
  public itemUnitPricingMethodName!: string;
  public unitName?: string;
  public pricingMethodId!: number;
  public pricingMethodName?: string;
  public quantityMultiplier!: number;
  public price!: number;
  public barcode?: string;

  constructor(init?: Partial<ItemUnitPricingMethod>)
  {
    super();
    Object.assign(this, init);
  }
}

export class ItemTax extends BaseEntity
{
  public itemId!: number;
  public taxId!: number;
  public taxName?: string;
  public taxPercentage!: number;

  constructor(init?: Partial<ItemTax>)
  {
    super();
    Object.assign(this, init);
  }
}

export class ItemStore extends BaseEntity
{
  public itemId!: number;
  public storeId!: number;
  public storeName?: string;
  public initialQuantity!: number;
  public quantity!: number;

  constructor(init?: Partial<ItemStore>)
  {
    super();
    Object.assign(this, init);
  }
}

export default class Item extends BaseEntity
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

  constructor(init?: Partial<Item>)
  {
    super();
    Object.assign(this, init);
    if (init?.itemUnitPricingMethods)
    {
      this.itemUnitPricingMethods = init.itemUnitPricingMethods.map((x) => new ItemUnitPricingMethod(x));
    }
    if (init?.itemTaxes)
    {
      this.itemTaxes = init.itemTaxes.map((x) => new ItemTax(x));
    }
    if (init?.itemStores)
    {
      this.itemStores = init.itemStores.map((x) => new ItemStore(x));
    }
    if (init?.itemImages)
    {
      this.itemImages = init.itemImages;
    }
  }
}

export class BarcodeResult
{
  public item!: Item;
  public selectedIupm!: ItemUnitPricingMethod;

  constructor(init?: Partial<BarcodeResult>)
  {
    Object.assign(this, init);
  }
}

export class ItemFilterColumns
{
  public static columnsNames = (
    t: TFunction<"stocking">
  ): ColumnName<Item>[] => [{ label: t("items.itemId"), value: "id" }, { label: t("items.itemName"), value: "name" }, {
    label: t("items.class"),
    value: "class"
  }];
}

export class ItemValidationRules
{
  public static validationRules = (t: TFunction<"stocking">): ValidationRule<Partial<Item>>[] => [{
    field: "name",
    selector: (d) => d.name,
    validators: [Validators.required(t("items.nameRequired"))]
  }, {
    field: "type",
    selector: (d) => d.type,
    validators: [Validators.required(t("items.typeRequired"))]
  }, {
    field: "itemUnitPricingMethods",
    selector: (d) => d.itemUnitPricingMethods,
    validators: [
      Validators.arrayMinLength(1, t("items.pricingMethodsRequired")),
      Validators.custom(
        (methods: any[], form) =>
        {
          if (!methods || methods.length === 0)
          {
            return true;
          }

          const isService = form.type === ItemType.Service;

          for (let i = 0; i < methods.length; i++)
          {
            const m = methods[i];
            if (!isService && !m.unitId)
            {
              return false;
            }
            if (!isService && !m.pricingMethodId)
            {
              return false;
            }

            if (m.quantityMultiplier === undefined || m.quantityMultiplier === null || m.quantityMultiplier <= 0)
            {
              return false;
            }
            if (m.price === undefined || m.price === null || m.price < 0)
            {
              return false;
            }
          }
          return true;
        },
        t("items.pricingMethodsValidationError")
      )
    ]
  }, {
    field: "itemStores",
    selector: (d) => d.itemStores,
    validators: [Validators.custom(
      (stores: any[], form) =>
      {
        if (form.type === ItemType.Service || (!stores || stores.length === 0))
        {
          return true;
        }

        if (stores.length < 0)
        {
          return false;
        }

        for (let i = 0; i < stores.length; i++)
        {
          const s = stores[i];
          if (!s.storeId)
          {
            return false;
          }
          if ((s.initialQuantity == undefined || s.initialQuantity < 0))
          {
            return false;
          }
        }

        return true;
      },
      t("items.storesValidationError")
    )]
  }, {
    field: "sellUnitId",
    selector: (d) => d.sellUnitId,
    validators: [Validators.custom(
      (val, form) => form.type === ItemType.Service || (val !== null && val !== undefined && val !== ""),
      t("items.baseUnitRequired")
    )]
  }, {
    field: "initialCost",
    selector: (d) => d.initialCost,
    validators: [Validators.required(t("items.initialCostRequired"))]
  }];
}

export class ItemSlice
{
  private static entitySliceInstance = createGenericEntitySlice("item", new ItemsApiService());
  public static entityActions = ItemSlice.entitySliceInstance.actions;
  public static entityReducer = ItemSlice.entitySliceInstance.reducer;

  private static dialogSliceInstance = createGenericDialogSlice<Item>("itemDialog");
  public static dialogActions = ItemSlice.dialogSliceInstance.actions;
  public static dialogReducer = ItemSlice.dialogSliceInstance.reducer;

  private static formSliceInstance = createGenericFormSlice<Item>("itemForm");
  public static formActions = ItemSlice.formSliceInstance.actions;
  public static formReducer = ItemSlice.formSliceInstance.reducer;
}

export function generateBarcode(length = 12)
{
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from(
    { length },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join("");
}
