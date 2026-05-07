import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { SystemApiService } from "../../networking";
import type { SystemPermissionsState } from "../../types";

export const fetchSystemPermissions = createAsyncThunk(
  "system/fetchPermissions",
  async () =>
  {
    const res = await new SystemApiService().GetSystemPermissions();
    return res.data ?? [];
  }
);

const initialState: SystemPermissionsState = { permissions: [], isLoading: false };

const systemSlice = createSlice({
  name: "system",
  initialState,
  reducers: {},
  extraReducers: (builder) =>
  {
    builder
      .addCase(fetchSystemPermissions.pending, (state) =>
      {
        state.isLoading = true;
      })
      .addCase(fetchSystemPermissions.fulfilled, (state, action) =>
      {
        state.isLoading = false;
        state.permissions = action.payload;
      })
      .addCase(fetchSystemPermissions.rejected, (state) =>
      {
        state.isLoading = false;
      });
  }
});

export const systemReducer = systemSlice.reducer;
