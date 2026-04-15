import { createGenericDialogSlice } from "@yusr_systems/ui";
import type { Passenger } from "../data/passenger";

export const passengerDialogSlice = createGenericDialogSlice<Passenger>("passengerDialog");

export const {
  openChangeDialog: openPassengerChangeDialog,
  openDeleteDialog: openPassengerDeleteDialog,
  setIsChangeDialogOpen: setIsPassengerChangeDialogOpen,
  setIsDeleteDialogOpen: setIsPassengerDeleteDialogOpen
} = passengerDialogSlice.actions;

export default passengerDialogSlice.reducer;
