import { createGenericDialogSlice } from "yusr-ui";
import type { Route } from "../data/route";

export const routeDialogSlice = createGenericDialogSlice<Route>("routeDialog");

export const {
  openChangeDialog: openRouteChangeDialog,
  openDeleteDialog: openRouteDeleteDialog,
  setIsChangeDialogOpen: setIsRouteChangeDialogOpen,
  setIsDeleteDialogOpen: setIsRouteDeleteDialogOpen
} = routeDialogSlice.actions;

export default routeDialogSlice.reducer;
