import { BranchesApiService } from "../networking/branchesApiService";
import { createGenericDialogSlice, createGenericEntitySlice, createGenericFormSlice } from "../state";
import type { Branch } from "./branch";

export class BranchSlice
{
  private static entitySliceInstance = createGenericEntitySlice("branch", new BranchesApiService());
  public static entityActions = BranchSlice.entitySliceInstance.actions;
  public static entityReducer = BranchSlice.entitySliceInstance.reducer;

  private static dialogSliceInstance = createGenericDialogSlice<Branch>("branchDialog");
  public static dialogActions = BranchSlice.dialogSliceInstance.actions;
  public static dialogReducer = BranchSlice.dialogSliceInstance.reducer;

  private static formSliceInstance = createGenericFormSlice<Branch>("branchForm");
  public static formActions = BranchSlice.formSliceInstance.actions;
  public static formReducer = BranchSlice.formSliceInstance.reducer;
}
