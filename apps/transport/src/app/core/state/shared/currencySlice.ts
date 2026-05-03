import { Currency, CurrenciesApiService } from "yusr-ui";
import { createGenericEntitySlice } from "yusr-ui";

const citySlice = createGenericEntitySlice<Currency>("currency", new CurrenciesApiService());

export const { setCurrentPage: setCurrentCurrenciesPage, refresh: refreshCurrencies, filter: filterCurrencies } =
  citySlice.actions;
export default citySlice.reducer;
