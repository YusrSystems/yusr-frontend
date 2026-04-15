import { createGenericDialogSlice } from "yusr-ui";
import type { Ticket } from "../data/ticket";

export const TicketDialogSlice = createGenericDialogSlice<Ticket>("ticketDialog");

export const {
  openChangeDialog: openTicketChangeDialog,
  openDeleteDialog: openTicketDeleteDialog,
  setIsChangeDialogOpen: setIsTicketChangeDialogOpen,
  setIsDeleteDialogOpen: setIsTicketDeleteDialogOpen
} = TicketDialogSlice.actions;

export default TicketDialogSlice.reducer;
