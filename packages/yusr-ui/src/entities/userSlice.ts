import { UsersApiServiceOld } from "../networking/usersApiService";
import { createGenericDialogSlice, createGenericEntitySlice, createGenericFormSlice } from "../state";
import type { UserOld } from "./userOld";

export class UserSlice
{
  private static entitySliceInstance = createGenericEntitySlice("user", new UsersApiServiceOld());
  public static entityActions = UserSlice.entitySliceInstance.actions;
  public static entityReducer = UserSlice.entitySliceInstance.reducer;

  private static dialogSliceInstance = createGenericDialogSlice<UserOld>("userDialog");
  public static dialogActions = UserSlice.dialogSliceInstance.actions;
  public static dialogReducer = UserSlice.dialogSliceInstance.reducer;

  private static formSliceInstance = createGenericFormSlice<UserOld>("userForm");
  public static formActions = UserSlice.formSliceInstance.actions;
  public static formReducer = UserSlice.formSliceInstance.reducer;
}
