import { type ActionReducerMapBuilder, createAsyncThunk } from "@reduxjs/toolkit";
import { CitiesApiService } from "yusr-core";
import type { RegisterState } from "./registerSlice";

export default class RegisterActions
{
  public static fetchCitiesAsync = createAsyncThunk("register/fetchCities", async () =>
  {
    const service = new CitiesApiService();
    const cities = await service.Filter(1, 10);
    return cities;
  });
  public static addCitiesCases(builder: ActionReducerMapBuilder<RegisterState>)
  {
    builder.addCase(this.fetchCitiesAsync.pending, (state: RegisterState) =>
    {
      state.loading = true;
    }).addCase(this.fetchCitiesAsync.fulfilled, (state, action) =>
    {
      state.loading = false;
      state.cities = action.payload.data?.data || [];
    });
  }
}
