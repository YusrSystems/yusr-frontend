import { BaseEntity, type ColumnName, type ValidationRule, Validators } from "yusr-ui";
import { createGenericDialogSlice, createGenericEntitySlice, createGenericFormSlice } from "yusr-ui";
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
  public itemsSettlementItems: ItemsSettlementItem[] = [];
  public stocktakingItems: IStocktakingItem[] = this.itemsSettlementItems;

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

export class ItemsSettlementFilterColumns
{
  public static columnsNames: ColumnName<ItemsSettlement>[] = [{ label: "رقم التسوية", value: "id" }, {
    label: "المستودع",
    value: "storeName"
  }, { label: "الوصف", value: "description" }];
}

export class ItemsSettlementValidationRules
{
  public static validationRules: ValidationRule<Partial<ItemsSettlement>>[] = [
    {
      field: "storeId",
      selector: (d) => d.storeId,
      validators: [Validators.required("يرجى اختيار المستودع")]
    },
    { field: "date", selector: (d) => d.date, validators: [Validators.required("يرجى اختيار التاريخ")] },
    {
      field: "items",
      selector: (d) => d.itemsSettlementItems,
      validators: [Validators.arrayMinLength(1, "يرجى إضافة مادة واحدة على الأقل للتسوية")]
    }
  ];
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
