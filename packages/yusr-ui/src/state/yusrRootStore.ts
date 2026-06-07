import type { ThunkDispatch, UnknownAction } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { createAuthSlice } from "../auth";
import type { BranchOld, CityOld, CurrencyOld, RoleOld, UserOld } from "../entities";
import type { SystemPermissionsState } from "../types";
import type { IDialogState } from "./interfaces/iDialogState";
import type { IEntityState } from "./interfaces/iEntityState";
import type { IFormState } from "./interfaces/iFormState";

type AuthSlice = ReturnType<typeof createAuthSlice<UserOld, object>>;

export type YusrRootState = {
  auth: ReturnType<AuthSlice["reducer"]>;
  branch: IEntityState<BranchOld>;
  branchForm: IFormState<BranchOld>;
  branchDialog: IDialogState<BranchOld>;
  role: IEntityState<RoleOld>;
  roleForm: IFormState<RoleOld>;
  roleDialog: IDialogState<RoleOld>;
  user: IEntityState<UserOld>;
  userForm: IFormState<UserOld>;
  userDialog: IDialogState<UserOld>;
  city: IEntityState<CityOld>;
  currency: IEntityState<CurrencyOld>;
  system: SystemPermissionsState;
};

export type YusrAppDispatch = ThunkDispatch<YusrRootState, undefined, UnknownAction>;
export const useAppDispatch = () => useDispatch<YusrAppDispatch>();
