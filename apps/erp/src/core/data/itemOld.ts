import { type TFunction } from "i18next";
import { BaseEntity, createGenericDialogSlice, createGenericEntitySlice, createGenericFormSlice, type StorageFile, type ValidationRuleOld, Validators } from "yusr-ui";
import ItemsApiServiceOld from "../networking/itemApiServiceOld";

export const ItemType = {
  Product: 1,
  Service: 2
};
export type ItemType = (typeof ItemType)[keyof typeof ItemType];

export class ItemUnitPricingMethodOld extends BaseEntity
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

  constructor(init?: Partial<ItemUnitPricingMethodOld>)
  {
    super();
    Object.assign(this, init);
  }
}

export class ItemTaxOld extends BaseEntity
{
  public itemId!: number;
  public taxId!: number;
  public taxName?: string;
  public taxPercentage!: number;

  constructor(init?: Partial<ItemTaxOld>)
  {
    super();
    Object.assign(this, init);
  }
}

export class ItemStoreOld extends BaseEntity
{
  public itemId!: number;
  public storeId!: number;
  public storeName?: string;
  public initialQuantity!: number;
  public quantity!: number;

  constructor(init?: Partial<ItemStoreOld>)
  {
    super();
    Object.assign(this, init);
  }
}

export default class ItemOld extends BaseEntity
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

  public itemUnitPricingMethods: ItemUnitPricingMethodOld[] = [];
  public itemTaxes: ItemTaxOld[] = [];
  public itemStores: ItemStoreOld[] = [];
  public itemImages: StorageFile[] = [];

  constructor(init?: Partial<ItemOld>)
  {
    super();
    Object.assign(this, init);
    if (init?.itemUnitPricingMethods)
    {
      this.itemUnitPricingMethods = init.itemUnitPricingMethods.map((x) => new ItemUnitPricingMethodOld(x));
    }
    if (init?.itemTaxes)
    {
      this.itemTaxes = init.itemTaxes.map((x) => new ItemTaxOld(x));
    }
    if (init?.itemStores)
    {
      this.itemStores = init.itemStores.map((x) => new ItemStoreOld(x));
    }
    if (init?.itemImages)
    {
      this.itemImages = init.itemImages;
    }
  }
}

export class BarcodeResultOld
{
  public item!: ItemOld;
  public selectedIupm!: ItemUnitPricingMethodOld;

  constructor(init?: Partial<BarcodeResultOld>)
  {
    Object.assign(this, init);
  }
}

export class ItemValidationRules
{
  public static validationRules = (t: TFunction<"stocking">): ValidationRuleOld<Partial<ItemOld>>[] => [{
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
  private static entitySliceInstance = createGenericEntitySlice("item", new ItemsApiServiceOld());
  public static entityActions = ItemSlice.entitySliceInstance.actions;
  public static entityReducer = ItemSlice.entitySliceInstance.reducer;

  private static dialogSliceInstance = createGenericDialogSlice<ItemOld>("itemDialog");
  public static dialogActions = ItemSlice.dialogSliceInstance.actions;
  public static dialogReducer = ItemSlice.dialogSliceInstance.reducer;

  private static formSliceInstance = createGenericFormSlice<ItemOld>("itemForm");
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
