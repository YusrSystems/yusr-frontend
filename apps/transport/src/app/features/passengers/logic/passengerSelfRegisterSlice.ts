import PassengersApiService from "@/app/core/networking/passengersApiService";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { Passenger } from "../data/passenger";

interface RegisterArgs
{
  key: string;
  passenger: Passenger;
}

export const selfRegister = createAsyncThunk(
  "passengerSelfRegister/SelfRegister",
  async ({ key, passenger }: RegisterArgs, { rejectWithValue }) =>
  {
    try
    {
      const res = await new PassengersApiService().SelfRegister(key, passenger);
      return !!res.data;
    }
    catch (error: any)
    {
      return rejectWithValue(error.response?.data || "فشل التسجيل");
    }
  }
);

interface PassengerSelfRegisterState
{
  completed: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: PassengerSelfRegisterState = { completed: false, isLoading: false, error: null };

const passengerSelfRegisterSlice = createSlice({
  name: "passengerSelfRegister",
  initialState,
  reducers: {
    resetRegistration: (state) =>
    {
      state.completed = false;
      state.isLoading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) =>
  {
    builder.addCase(selfRegister.pending, (state) =>
    {
      state.isLoading = true;
      state.error = null;
    }).addCase(selfRegister.fulfilled, (state, action) =>
    {
      state.isLoading = false;
      state.completed = action.payload;
    }).addCase(selfRegister.rejected, (state, action) =>
    {
      state.isLoading = false;
      state.completed = false;
      state.error = action.payload as string;
    });
  }
});

export const { resetRegistration } = passengerSelfRegisterSlice.actions;
export default passengerSelfRegisterSlice.reducer;
