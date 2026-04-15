import TripsApiService from "@/app/core/networking/tripsApiService";
import { createGenericEntitySlice } from "@yusr_systems/ui";

const { reducer, actions } = createGenericEntitySlice("trip", new TripsApiService());

export const { setCurrentPage: setCurrentTripsPage, refresh: refreshTrips, filter: filterTrips } = actions;
export default reducer;
