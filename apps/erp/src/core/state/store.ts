import { configureStore } from "@reduxjs/toolkit";
import { type TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import {
  BranchSlice,
  CitySlice,
  createAuthSlice,
  CurrencySlice,
  RoleSlice,
  setupAuthListenersForRedux,
  UserOld,
  UserSlice,
  type YusrAppDispatch,
  type YusrRootState
} from "yusr-ui";


const authSlice = createAuthSlice<UserOld, SettingOld>();
export const {
	login,
	logout,
	updateLoggedInUser,
	updateSetting,
	syncFromStorage
} = authSlice.actions;

export const store = configureStore({
	reducer: {
		branch: BranchSlice.entityReducer,
		branchForm: BranchSlice.formReducer,
		branchDialog: BranchSlice.dialogReducer,
		role: RoleSlice.entityReducer,
		roleForm: RoleSlice.formReducer,
		roleDialog: RoleSlice.dialogReducer,
		user: UserSlice.entityReducer,
		userForm: UserSlice.formReducer,
		userDialog: UserSlice.dialogReducer,
		city: CitySlice.entityReducer,
		currency: CurrencySlice.entityReducer,
		auth: authSlice.reducer

	}
});

setupAuthListenersForRedux(store.dispatch, {
	logout: authSlice.actions.logout,
	syncFromStorage: authSlice.actions.syncFromStorage
});

export type RootState = ReturnType<typeof store.getState> & YusrRootState;
export type AppDispatch = YusrAppDispatch & typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
