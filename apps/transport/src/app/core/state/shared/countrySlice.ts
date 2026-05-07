import { CountriesApiService, Country } from "yusr-ui";
import { createGenericEntitySlice } from "yusr-ui";

const countrySlice = createGenericEntitySlice<Country>("country", new CountriesApiService());

export const { setCurrentPage: setCurrentCountriesPage, refresh: refreshCountries, filter: filterCountries } =
  countrySlice.actions;
export default countrySlice.reducer;
