import type { User } from "yusr-ui";
import { createGenericDialogSlice } from "yusr-ui";

export const userDialogSlice = createGenericDialogSlice<User>("userDialog");

export const {
  openChangeDialog: openUserChangeDialog,
  openDeleteDialog: openUserDeleteDialog,
  setIsChangeDialogOpen: setIsUserChangeDialogOpen,
  setIsDeleteDialogOpen: setIsUserDeleteDialogOpen
} = userDialogSlice.actions;

export default userDialogSlice.reducer;
