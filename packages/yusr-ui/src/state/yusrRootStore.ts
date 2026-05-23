import type { ThunkDispatch, UnknownAction } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { createAuthSlice } from "../auth";
import type { Branch, City, Currency, Role, User } from "../entities";
import type { SystemPermissionsState } from "../types";
import type { IDialogState } from "./interfaces/iDialogState";
import type { IEntityState } from "./interfaces/iEntityState";
import type { IFormState } from "./interfaces/iFormState";

type AuthSlice = ReturnType<typeof createAuthSlice<User, object>>;

export type YusrRootState = {
  auth: ReturnType<AuthSlice["reducer"]>;
  branch: IEntityState<Branch>;
  branchForm: IFormState<Branch>;
  branchDialog: IDialogState<Branch>;
  role: IEntityState<Role>;
  roleForm: IFormState<Role>;
  roleDialog: IDialogState<Role>;
  user: IEntityState<User>;
  userForm: IFormState<User>;
  userDialog: IDialogState<User>;
  city: IEntityState<City>;
  currency: IEntityState<Currency>;
  system: SystemPermissionsState;
};

export type YusrAppDispatch = ThunkDispatch<YusrRootState, undefined, UnknownAction>;
export const useAppDispatch = () => useDispatch<YusrAppDispatch>();
