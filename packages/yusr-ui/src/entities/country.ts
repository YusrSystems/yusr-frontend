import { CountriesApiService } from "../networking";
import { createGenericEntitySlice } from "../state";
import { BaseEntity } from "./baseEntity";

export class Country extends BaseEntity
{
  public name!: string;
  public code!: string;

  constructor(init?: Partial<Country>)
  {
    super();
    Object.assign(this, init);
  }
}

export class CountrySlice
{
  private static entitySliceInstance = createGenericEntitySlice<Country>("country", new CountriesApiService());
  public static entityActions = CountrySlice.entitySliceInstance.actions;
  public static entityReducer = CountrySlice.entitySliceInstance.reducer;
}
