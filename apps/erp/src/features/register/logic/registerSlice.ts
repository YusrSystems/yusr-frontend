import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { City, Currency } from "yusr-core";
import type Registration from "../../../core/data/registration";
import RegisterApiService from "../../../core/networking/registerApiService";
import RegisterActions from "./registerActions";

export interface RegisterState
{
  formData: Partial<Registration>;
  currentStep: number;
  loading: boolean;
  successed: boolean;
  errors: Partial<Record<keyof Registration, string>>;
  currencies?: Currency[];
  cities: City[];
  acceptPolicies?: boolean;
}

const initialState: RegisterState = {
  formData: {},
  currentStep: 0,
  loading: false,
  successed: false,
  errors: {},
  currencies: [],
  cities: [],
  acceptPolicies: false
};

export const registerSlice = createSlice({
  name: "register",
  initialState,
  reducers: {
    citySelected(state, action: PayloadAction<{ cityId: number; }>)
    {
      const city = state.cities.find((c) => c.id === action.payload.cityId);
      if (city)
      {
        state.formData.cityId = action.payload.cityId;
      }
    },
    updateField(state, action: PayloadAction<Partial<Registration>>)
    {
      state.formData = { ...state.formData, ...action.payload };
    },
    nextStep(state)
    {
      state.currentStep += 1;
    },
    prevStep(state)
    {
      state.currentStep -= 1;
    },
    setErrors(
      state,
      action: PayloadAction<Partial<Record<keyof Registration, string>>>
    )
    {
      state.errors = action.payload;
    },
    acceptPoliciesToggle(state)
    {
      state.acceptPolicies = !state.acceptPolicies;
    }
  },
  extraReducers: (builder) =>
  {
    builder
      .addCase(registerAsync.pending, (state) =>
      {
        state.loading = true;
      })
      .addCase(registerAsync.fulfilled, (state) =>
      {
        state.loading = false;
        state.successed = true;
        state.formData = {};
        state.currentStep = 0;
        state.errors = {};
        state.successed = false;
      })
      .addCase(registerAsync.rejected, (state) =>
      {
        state.loading = false;
        state.successed = false;
      });

    RegisterActions.addCitiesCases(builder);
    RegisterActions.addCurrenciesCases(builder);
  }
});

export const registerAsync = createAsyncThunk(
  "register/register",
  async (data: Registration) =>
  {
    const res = await new RegisterApiService().register(data);

    return res.data ?? null;
  }
);

export const {
  citySelected,
  updateField,
  nextStep,
  prevStep,
  setErrors,
  acceptPoliciesToggle
} = registerSlice.actions;
export default registerSlice.reducer;
