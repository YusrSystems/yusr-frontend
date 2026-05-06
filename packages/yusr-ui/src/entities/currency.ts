import { CurrenciesApiService } from "../networking";
import { createGenericEntitySlice } from "../state";
import { BaseEntity } from "./baseEntity";

export class Currency extends BaseEntity
{
  public name!: string;
  public code!: string;
  public isFeminine!: boolean;
  public plural!: string;
  public subName!: string;
  public subIsFeminine!: boolean;
  public subPlural!: string;

  constructor(init?: Partial<Currency>)
  {
    super();
    Object.assign(this, init);
  }
}

export class CurrencySlice
{
  private static entitySliceInstance = createGenericEntitySlice<Currency>("currency", new CurrenciesApiService());
  public static entityActions = CurrencySlice.entitySliceInstance.actions;
  public static entityReducer = CurrencySlice.entitySliceInstance.reducer;
}
