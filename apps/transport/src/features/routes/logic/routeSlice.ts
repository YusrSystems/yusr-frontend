import RoutesApiService from "@/core/networking/routesApiService";
import { createGenericEntitySlice } from "yusr-ui";

const { reducer, actions } = createGenericEntitySlice("route", new RoutesApiService());

export const { setCurrentPage: setCurrentRoutesPage, refresh: refreshRoutes, filter: filterRoutes } = actions;
export default reducer;
