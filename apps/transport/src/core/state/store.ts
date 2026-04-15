
import { type TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { Setting } from "../data/setting";
import cityReducer from "./shared/citySlice";
import countryReducer from "./shared/countrySlice";
import currencyReducer from "./shared/currencySlice";
import systemReducer from "./shared/systemSlice";
import { configureStore } from "@reduxjs/toolkit"; 
import { createAuthSlice, User } from "yusr-core";



import branchDialogReducer from "@/features/branches/logic/branchDialogSlice";
import branchReducer from "@/features/branches/logic/branchSlice";
import passengerDialogReducer from "@/features/passengers/logic/passengerDialogSlice";
import passengerReducer from "@/features/passengers/logic/passengerSlice";
import roleDialogReducer from "@/features/roles/logic/roleDialogSlice";
import roleReducer from "@/features/roles/logic/roleSlice";
import routeDialogReducer from "@/features/routes/logic/routeDialogSlice";
import routeReducer from "@/features/routes/logic/routeSlice";
import tripDialogReducer from "@/features/trips/logic/tripDialogSlice";
import tripReducer from "@/features/trips/logic/tripSlice";
 import userDialogReducer from "@/features/users/logic/userDialogSlice"; 
import userReducer from "@/features/users/logic/userSlice";
import { setupAuthListeners } from "yusr-ui";



const authSlice = createAuthSlice<User, Setting>();
export const { login, logout, updateLoggedInUser, updateSetting, syncFromStorage } = authSlice.actions;

export const store = configureStore({
  reducer: {
    branch: branchReducer,
    branchDialog: branchDialogReducer,
    role: roleReducer,
    roleDialog: roleDialogReducer,
    route: routeReducer,
    routeDialog: routeDialogReducer,
    user: userReducer,
    userDialog: userDialogReducer,
    passenger: passengerReducer,
    passengerDialog: passengerDialogReducer,
    trip: tripReducer,
    tripDialog: tripDialogReducer,
    city: cityReducer,
    country: countryReducer,
    currency: currencyReducer,
    auth: authSlice.reducer,
    system: systemReducer
  }
});

setupAuthListeners(store.dispatch, {
  logout: authSlice.actions.logout,
  syncFromStorage: authSlice.actions.syncFromStorage
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
