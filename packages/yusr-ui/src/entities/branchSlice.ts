import { BranchesApiServiceOld } from "../networking/branchesApiServiceOld";
import { createGenericDialogSlice, createGenericEntitySlice, createGenericFormSlice } from "../state";
import type { BranchOld } from "./branch";

export class BranchSlice
{
  private static entitySliceInstance = createGenericEntitySlice("branch", new BranchesApiServiceOld());
  public static entityActions = BranchSlice.entitySliceInstance.actions;
  public static entityReducer = BranchSlice.entitySliceInstance.reducer;

  private static dialogSliceInstance = createGenericDialogSlice<BranchOld>("branchDialog");
  public static dialogActions = BranchSlice.dialogSliceInstance.actions;
  public static dialogReducer = BranchSlice.dialogSliceInstance.reducer;

  private static formSliceInstance = createGenericFormSlice<BranchOld>("branchForm");
  public static formActions = BranchSlice.formSliceInstance.actions;
  public static formReducer = BranchSlice.formSliceInstance.reducer;
}
