import { createGenericEntitySlice } from "../state";
import { CurrenciesApiService } from "../networking/currenciesApiService";
import type { Currency } from "./currency";

export class CurrencySlice
{
  private static entitySliceInstance = createGenericEntitySlice<Currency>("currency", new CurrenciesApiService());
  public static entityActions = CurrencySlice.entitySliceInstance.actions;
  public static entityReducer = CurrencySlice.entitySliceInstance.reducer;
}
