import PassengersApiService from "@/core/networking/passengersApiService";
import { createGenericEntitySlice } from "yusr-ui";

const { reducer, actions } = createGenericEntitySlice("passenger", new PassengersApiService());

export const { setCurrentPage: setCurrentPassengersPage, refresh: refreshPassengers, filter: filterPassengers } =
  actions;
export default reducer;
