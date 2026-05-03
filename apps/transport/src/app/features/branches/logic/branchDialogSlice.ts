import type { Branch } from "yusr-ui";
import { createGenericDialogSlice } from "yusr-ui";
export const branchDialogSlice = createGenericDialogSlice<Branch>("branchDialog");

export const {
  openChangeDialog: openBranchChangeDialog,
  openDeleteDialog: openBranchDeleteDialog,
  setIsChangeDialogOpen: setIsBranchChangeDialogOpen,
  setIsDeleteDialogOpen: setIsBranchDeleteDialogOpen
} = branchDialogSlice.actions;

export default branchDialogSlice.reducer;
