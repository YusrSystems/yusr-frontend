import { type TFunction } from "i18next";
import { BaseEntity, createGenericDialogSlice, createGenericEntitySlice, createGenericFormSlice, type ValidationRuleOld, Validators } from "yusr-ui";
import ItemsSettlementsApiService from "../networking/itemsSettlementsApiService";
import type { IStocktaking, IStocktakingItem } from "./stocktaking";

export class ItemsSettlementItem extends BaseEntity implements IStocktakingItem
{
  public itemsSettlementId!: number;
  public itemId!: number;
  public itemName!: string;
  public itemUnitPricingMethodId!: number;
  public itemUnitPricingMethodName!: string;
  public quantityMultiplier!: number;
  public systemQuantity!: number;
  public actualQuantity!: number;
  public variance!: number;

  constructor(init?: Partial<ItemsSettlementItem>)
  {
    super();
    Object.assign(this, init);
  }
}

export default class ItemsSettlement extends BaseEntity implements IStocktaking
{
  public description?: string;
  public date!: string | Date;
  public storeId!: number;
  public storeName!: string;
  public items: ItemsSettlementItem[] = [];

  constructor(init?: Partial<ItemsSettlement>)
  {
    super();
    Object.assign(this, init);
    if (init?.items)
    {
      this.items = init.items.map((x) => new ItemsSettlementItem(x));
      this.items = this.items;
    }
  }
}

export class ItemsSettlementValidationRules
{
  public static validationRules = (t: TFunction<"stocking">): ValidationRuleOld<Partial<ItemsSettlement>>[] => [{
    field: "storeId",
    selector: (d) => d.storeId,
    validators: [Validators.required(t("itemsSettlements.storeRequired"))]
  }, {
    field: "date",
    selector: (d) => d.date,
    validators: [Validators.required(t("itemsSettlements.dateRequired"))]
  }, {
    field: "items",
    selector: (d) => d.items,
    validators: [Validators.arrayMinLength(1, t("itemsSettlements.itemsRequired"))]
  }];
}

export class ItemsSettlementSlice
{
  private static entitySliceInstance = createGenericEntitySlice("itemsSettlement", new ItemsSettlementsApiService());
  public static entityActions = ItemsSettlementSlice.entitySliceInstance.actions;
  public static entityReducer = ItemsSettlementSlice.entitySliceInstance.reducer;

  private static dialogSliceInstance = createGenericDialogSlice<ItemsSettlement>("itemsSettlementDialog");
  public static dialogActions = ItemsSettlementSlice.dialogSliceInstance.actions;
  public static dialogReducer = ItemsSettlementSlice.dialogSliceInstance.reducer;

  private static formSliceInstance = createGenericFormSlice<ItemsSettlement>("itemsSettlementForm");
  public static formActions = ItemsSettlementSlice.formSliceInstance.actions;
  public static formReducer = ItemsSettlementSlice.formSliceInstance.reducer;
}
