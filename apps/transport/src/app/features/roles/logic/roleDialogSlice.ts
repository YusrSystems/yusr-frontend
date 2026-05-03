import type { Role } from "yusr-ui";
import { createGenericDialogSlice } from "yusr-ui";

export const roleDialogSlice = createGenericDialogSlice<Role>("roleDialog");

export const {
  openChangeDialog: openRoleChangeDialog,
  openDeleteDialog: openRoleDeleteDialog,
  setIsChangeDialogOpen: setIsRoleChangeDialogOpen,
  setIsDeleteDialogOpen: setIsRoleDeleteDialogOpen
} = roleDialogSlice.actions;

export default roleDialogSlice.reducer;
