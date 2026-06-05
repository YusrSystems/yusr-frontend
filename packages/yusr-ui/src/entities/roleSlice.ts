import { RolesApiService } from "../networking/rolesApiService";
import { createGenericDialogSlice, createGenericEntitySlice, createGenericFormSlice } from "../state";
import type { Role } from "./role";

export class RoleSlice
{
  private static entitySliceInstance = createGenericEntitySlice("role", new RolesApiService());
  public static entityActions = RoleSlice.entitySliceInstance.actions;
  public static entityReducer = RoleSlice.entitySliceInstance.reducer;

  private static dialogSliceInstance = createGenericDialogSlice<Role>("roleDialog");
  public static dialogActions = RoleSlice.dialogSliceInstance.actions;
  public static dialogReducer = RoleSlice.dialogSliceInstance.reducer;

  private static formSliceInstance = createGenericFormSlice<Role>("roleForm");
  public static formActions = RoleSlice.formSliceInstance.actions;
  public static formReducer = RoleSlice.formSliceInstance.reducer;
}
