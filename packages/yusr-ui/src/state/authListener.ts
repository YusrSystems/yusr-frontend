import type { Dispatch, UnknownAction } from "@reduxjs/toolkit";
import { AuthConstants } from "../auth";

interface AuthActions
{
  logout: () => any;
  syncFromStorage: () => any;
}

export const setupAuthListenersForRedux = (dispatch: Dispatch<UnknownAction>, actions: AuthActions) =>
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

export const setupAuthListeners = (actions: AuthActions) =>
{
  window.addEventListener(AuthConstants.AuthCheckStorageItemName, () =>
  {
    actions.syncFromStorage();
  });

  window.addEventListener(AuthConstants.UnauthorizedEventName, () =>
  {
    actions.logout();
  });
};
