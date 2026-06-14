import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type DashboardDataOld from "../../../core/data/dashboardDataOld.ts";
import DashboardApiServiceOld from "../../../core/networking/dashboardApiServiceOld.ts";

export interface DashboardState
{
  data: DashboardDataOld | undefined;
}
const initialDashboardState = {
  data: undefined
};

export const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: initialDashboardState,
  reducers: {},
  extraReducers: (builder) =>
  {
    builder.addCase(fetchDashboardData.fulfilled, (state: DashboardState, action) =>
    {
      state.data = action.payload;
    });
  }
});

export const fetchDashboardData = createAsyncThunk("dashboard/fetchDashboardData", async () =>
{
  const res = await new DashboardApiServiceOld().get();

  return res.data;
});

export default dashboardSlice.reducer;
