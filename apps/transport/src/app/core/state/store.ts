import branchDialogReducer from "@/app/features/branches/logic/branchDialogSlice";
import branchReducer from "@/app/features/branches/logic/branchSlice";
import passengerDialogReducer from "@/app/features/passengers/logic/passengerDialogSlice";
import passengerSelfRegisterReducer from "@/app/features/passengers/logic/passengerSelfRegisterSlice";
import passengerReducer from "@/app/features/passengers/logic/passengerSlice";
import roleDialogReducer from "@/app/features/roles/logic/roleDialogSlice";
import roleReducer from "@/app/features/roles/logic/roleSlice";
import routeDialogReducer from "@/app/features/routes/logic/routeDialogSlice";
import routeReducer from "@/app/features/routes/logic/routeSlice";
import tripDialogReducer from "@/app/features/trips/logic/tripDialogSlice";
import tripReducer from "@/app/features/trips/logic/tripSlice";
import type User from "@/app/features/users/data/user";
import userDialogReducer from "@/app/features/users/logic/userDialogSlice";
import userReducer from "@/app/features/users/logic/userSlice";
import { configureStore } from "@reduxjs/toolkit";
import { type TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { createAuthSlice } from "yusr-core";
import { setupAuthListeners } from "yusr-ui";
import type { Setting } from "../data/setting";
import { VehicleSlice } from "../data/vehicle";
import cityReducer from "./shared/citySlice";
import countryReducer from "./shared/countrySlice";
import currencyReducer from "./shared/currencySlice";
import systemReducer from "./shared/systemSlice";
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
    system: systemReducer,
    passengerSelfRegister: passengerSelfRegisterReducer,
    vehicle: VehicleSlice.entityReducer,
    vehicleDialog: VehicleSlice.dialogReducer
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
