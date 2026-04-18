import SystemApiService from "@/app/core/networking/systemApiService";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { Tenant } from "../../data/tenant";

export const fetchSystemPermissions = createAsyncThunk("system/fetchPermissions", async () =>
{
  const res = await new SystemApiService().GetSystemPermissions();
  return res.data ?? [];
});

export const GetTenantInfo = createAsyncThunk("system/GetTenantInfo", async (key: string) =>
{
  const res = await new SystemApiService().GetTenantInfo(key);
  return res.data;
});

interface SystemState
{
  permissions: string[];
  tenant: Tenant | undefined;
  isLoading: boolean;
}

const initialState: SystemState = { permissions: [], tenant: undefined, isLoading: false };

const systemSlice = createSlice({
  name: "system",
  initialState,
  reducers: {},
  extraReducers: (builder) =>
  {
    builder.addCase(fetchSystemPermissions.pending, (state) =>
    {
      state.isLoading = true;
    });
    builder.addCase(fetchSystemPermissions.fulfilled, (state, action) =>
    {
      state.isLoading = false;
      state.permissions = action.payload;
    });
    builder.addCase(fetchSystemPermissions.rejected, (state) =>
    {
      state.isLoading = false;
    });

    builder.addCase(GetTenantInfo.pending, (state) =>
    {
      state.isLoading = true;
    });
    builder.addCase(GetTenantInfo.fulfilled, (state, action) =>
    {
      state.isLoading = false;
      state.tenant = action.payload;
    });
    builder.addCase(GetTenantInfo.rejected, (state) =>
    {
      state.isLoading = false;
    });
  }
});

export default systemSlice.reducer;
