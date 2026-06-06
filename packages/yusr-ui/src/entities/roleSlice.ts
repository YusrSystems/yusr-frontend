import { RolesApiServiceOld } from "../networking/rolesApiService";
import { createGenericDialogSlice, createGenericEntitySlice, createGenericFormSlice } from "../state";
import type { RoleOld } from "./role";

export class RoleSlice
{
  private static entitySliceInstance = createGenericEntitySlice("role", new RolesApiServiceOld());
  public static entityActions = RoleSlice.entitySliceInstance.actions;
  public static entityReducer = RoleSlice.entitySliceInstance.reducer;

  private static dialogSliceInstance = createGenericDialogSlice<RoleOld>("roleDialog");
  public static dialogActions = RoleSlice.dialogSliceInstance.actions;
  public static dialogReducer = RoleSlice.dialogSliceInstance.reducer;

  private static formSliceInstance = createGenericFormSlice<RoleOld>("roleForm");
  public static formActions = RoleSlice.formSliceInstance.actions;
  public static formReducer = RoleSlice.formSliceInstance.reducer;
}
