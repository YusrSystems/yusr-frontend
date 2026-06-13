import { type TFunction } from "i18next";
import { BaseEntity, createGenericDialogSlice, createGenericEntitySlice, createGenericFormSlice, type ValidationRuleOld, Validators } from "yusr-ui";
import StocktakingsApiService from "../networking/stocktakingApiService";

export interface IStocktakingItem extends BaseEntity
{
  itemId: number;
  itemName: string;
  itemUnitPricingMethodId: number;
  itemUnitPricingMethodName: string;
  quantityMultiplier: number;
  systemQuantity: number;
  variance: number;
  actualQuantity: number;
}

export interface IStocktaking extends BaseEntity
{
  description?: string;
  date: string | Date;
  storeId: number;
  storeName: string;
  items: IStocktakingItem[];
}

export class StocktakingItem extends BaseEntity implements IStocktakingItem
{
  public stocktakingId!: number;
  public itemId!: number;
  public itemName!: string;
  public itemUnitPricingMethodId!: number;
  public itemUnitPricingMethodName!: string;
  public quantityMultiplier!: number;
  public systemQuantity!: number;
  public variance!: number;
  public actualQuantity!: number;

  constructor(init?: Partial<StocktakingItem>)
  {
    super();
    Object.assign(this, init);
  }
}

export default class Stocktaking extends BaseEntity implements IStocktaking
{
  public description?: string;
  public date!: string | Date;
  public storeId!: number;
  public storeName!: string;
  public items: StocktakingItem[] = [];

  constructor(init?: Partial<Stocktaking>)
  {
    super();
    Object.assign(this, init);
    if (init?.items)
    {
      this.items = init.items.map((x) => new StocktakingItem(x));
    }
  }
}

export class StocktakingValidationRules
{
  public static validationRules = (t: TFunction<"stocking">): ValidationRuleOld<Partial<Stocktaking>>[] => [{
    field: "storeId",
    selector: (d) => d.storeId,
    validators: [Validators.required(t("stocktakings.storeRequired"))]
  }, {
    field: "date",
    selector: (d) => d.date,
    validators: [Validators.required(t("stocktakings.dateRequired"))]
  }, {
    field: "items",
    selector: (d) => d.items,
    validators: [Validators.arrayMinLength(1, t("stocktakings.itemsRequired"))]
  }];
}

export class StocktakingSlice
{
  private static entitySliceInstance = createGenericEntitySlice("stocktaking", new StocktakingsApiService());
  public static entityActions = StocktakingSlice.entitySliceInstance.actions;
  public static entityReducer = StocktakingSlice.entitySliceInstance.reducer;

  private static dialogSliceInstance = createGenericDialogSlice<Stocktaking>("stocktakingDialog");
  public static dialogActions = StocktakingSlice.dialogSliceInstance.actions;
  public static dialogReducer = StocktakingSlice.dialogSliceInstance.reducer;

  private static formSliceInstance = createGenericFormSlice<Stocktaking>("stocktakingForm");
  public static formActions = StocktakingSlice.formSliceInstance.actions;
  public static formReducer = StocktakingSlice.formSliceInstance.reducer;
}
