import { type TFunction } from "i18next";
import { BaseEntity, createGenericDialogSlice, createGenericEntitySlice, createGenericFormSlice, type ValidationRuleOld, Validators } from "yusr-ui";
import ItemsSettlementsApiService from "../networking/itemsSettlementsApiService";
import type { IStocktakingItemOld, IStocktakingOld } from "./stocktakingOld";

export class ItemsSettlementItem extends BaseEntity implements IStocktakingItemOld
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

export default class ItemsSettlement extends BaseEntity implements IStocktakingOld
{
  public description?: string;
  public date!: string | Date;
  public storeId!: number;
  public storeName!: string;
  public itemsSettlementItems: ItemsSettlementItem[] = [];
  public stocktakingItems: IStocktakingItemOld[] = this.itemsSettlementItems;

  constructor(init?: Partial<ItemsSettlement>)
  {
    super();
    Object.assign(this, init);
    if (init?.itemsSettlementItems)
    {
      this.itemsSettlementItems = init.itemsSettlementItems.map((x) => new ItemsSettlementItem(x));
      this.stocktakingItems = this.itemsSettlementItems;
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
    selector: (d) => d.itemsSettlementItems,
    validators: [Validators.arrayMinLength(1, t("itemsSettlements.itemsRequired"))]
  }];
}

export class ItemsSettlementSlice
{
  private static entitySliceInstance = createGenericEntitySlice(
    "itemsSettlement",
    new ItemsSettlementsApiService() as any
  );
  public static entityActions = ItemsSettlementSlice.entitySliceInstance.actions;
  public static entityReducer = ItemsSettlementSlice.entitySliceInstance.reducer;

  private static dialogSliceInstance = createGenericDialogSlice<ItemsSettlement>("itemsSettlementDialog");
  public static dialogActions = ItemsSettlementSlice.dialogSliceInstance.actions;
  public static dialogReducer = ItemsSettlementSlice.dialogSliceInstance.reducer;

  private static formSliceInstance = createGenericFormSlice<ItemsSettlement>("itemsSettlementForm");
  public static formActions = ItemsSettlementSlice.formSliceInstance.actions;
  public static formReducer = ItemsSettlementSlice.formSliceInstance.reducer;
}
