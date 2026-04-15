import { createGenericDialogSlice } from "@yusr_systems/ui";
import type { Trip } from "../data/trip";

export const TripDialogSlice = createGenericDialogSlice<Trip>("tripDialog");

export const {
  openChangeDialog: openTripChangeDialog,
  openDeleteDialog: openTripDeleteDialog,
  setIsChangeDialogOpen: setIsTripChangeDialogOpen,
  setIsDeleteDialogOpen: setIsTripDeleteDialogOpen
} = TripDialogSlice.actions;

export default TripDialogSlice.reducer;
