import { type TFunction } from "i18next";
import { BaseEntity, type ValidationRuleOld, Validators } from "yusr-ui";

export interface IStocktakingItemOld extends BaseEntity
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

export interface IStocktakingOld extends BaseEntity
{
  description?: string;
  date: string | Date;
  storeId: number;
  storeName: string;
  stocktakingItems: IStocktakingItemOld[];
}

export class StocktakingItemOld extends BaseEntity implements IStocktakingItemOld
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

  constructor(init?: Partial<StocktakingItemOld>)
  {
    super();
    Object.assign(this, init);
  }
}

export default class StocktakingOld extends BaseEntity implements IStocktakingOld
{
  public description?: string;
  public date!: string | Date;
  public storeId!: number;
  public storeName!: string;
  public stocktakingItems: StocktakingItemOld[] = [];

  constructor(init?: Partial<StocktakingOld>)
  {
    super();
    Object.assign(this, init);
    if (init?.stocktakingItems)
    {
      this.stocktakingItems = init.stocktakingItems.map((x) => new StocktakingItemOld(x));
    }
  }
}

export class StocktakingValidationRules
{
  public static validationRules = (t: TFunction<"stocking">): ValidationRuleOld<Partial<StocktakingOld>>[] => [{
    field: "storeId",
    selector: (d) => d.storeId,
    validators: [Validators.required(t("stocktakings.storeRequired"))]
  }, {
    field: "date",
    selector: (d) => d.date,
    validators: [Validators.required(t("stocktakings.dateRequired"))]
  }, {
    field: "items",
    selector: (d) => d.stocktakingItems,
    validators: [Validators.arrayMinLength(1, t("stocktakings.itemsRequired"))]
  }];
}
