import { CountriesApiService } from "../networking/countriesApiService";
import { createGenericEntitySlice } from "../state";
import type { Country } from "./country";

export class CountrySlice
{
  private static entitySliceInstance = createGenericEntitySlice<Country>("country", new CountriesApiService());
  public static entityActions = CountrySlice.entitySliceInstance.actions;
  public static entityReducer = CountrySlice.entitySliceInstance.reducer;
}
