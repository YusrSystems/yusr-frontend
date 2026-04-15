import { createGenericDialogSlice } from "yusr-ui";
import type User from "../data/User.1";

export const userDialogSlice = createGenericDialogSlice<User>("userDialog");

export const {
  openChangeDialog: openUserChangeDialog,
  openDeleteDialog: openUserDeleteDialog,
  setIsChangeDialogOpen: setIsUserChangeDialogOpen,
  setIsDeleteDialogOpen: setIsUserDeleteDialogOpen
} = userDialogSlice.actions;

export default userDialogSlice.reducer;
