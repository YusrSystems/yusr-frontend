import { CurrenciesApiServiceOld } from "../networking/currenciesApiServiceOld";
import { createGenericEntitySlice } from "../state";
import type { CurrencyOld } from "./currency";

export class CurrencySlice
{
  private static entitySliceInstance = createGenericEntitySlice<CurrencyOld>("currency", new CurrenciesApiServiceOld());
  public static entityActions = CurrencySlice.entitySliceInstance.actions;
  public static entityReducer = CurrencySlice.entitySliceInstance.reducer;
}
