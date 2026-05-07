import { CitiesApiService, City } from "yusr-ui";
import { createGenericEntitySlice } from "yusr-ui";

const citySlice = createGenericEntitySlice<City>("city", new CitiesApiService());

export const { setCurrentPage: setCurrentCitiesPage, refresh: refreshCities, filter: filterCities } = citySlice.actions;
export default citySlice.reducer;
