import { createGenericDialogSlice } from "@yusr_systems/ui";
import type { Deposit } from "../data/deposit";

export const DepositDialogSlice = createGenericDialogSlice<Deposit>("depositDialog");

export const {
  openChangeDialog: openDepositChangeDialog,
  openDeleteDialog: openDepositDeleteDialog,
  setIsChangeDialogOpen: setIsDepositChangeDialogOpen,
  setIsDeleteDialogOpen: setIsDepositDeleteDialogOpen
} = DepositDialogSlice.actions;

export default DepositDialogSlice.reducer;
