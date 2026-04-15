import PassengersApiService from "@/app/core/networking/passengersApiService";
import { createGenericEntitySlice } from "@yusr_systems/ui";

const { reducer, actions } = createGenericEntitySlice("passenger", new PassengersApiService());

export const { setCurrentPage: setCurrentPassengersPage, refresh: refreshPassengers, filter: filterPassengers } =
  actions;
export default reducer;
