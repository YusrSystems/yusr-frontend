import type { Dispatch, UnknownAction } from "@reduxjs/toolkit";
import { AuthConstants } from "yusr-core";

interface AuthActions 
{
  logout: () => any;
  syncFromStorage: () => any;
}

export const setupAuthListeners = (dispatch: Dispatch<UnknownAction>, actions: AuthActions) =>
{
  window.addEventListener("storage", (e) =>
  {
    if (e.key === AuthConstants.AuthCheckStorageItemName)
    {
      dispatch(actions.syncFromStorage());
    }
  });

  window.addEventListener(AuthConstants.UnauthorizedEventName, () =>
  {
    dispatch(actions.logout());
  });
};
