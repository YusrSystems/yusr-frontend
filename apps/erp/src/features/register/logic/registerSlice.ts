import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { City, Currency, type ValidationRule, Validators } from "yusr-ui";
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

export const validationRules: ValidationRule<Partial<Registration>>[] = [{
  field: "username",
  selector: (d) => d.username,
  validators: [Validators.required("يرجى إدخال اسم المستخدم")]
}, {
  field: "userPassword",
  selector: (d) => d.userPassword,
  validators: [Validators.required("يرجى إدخال كلمة المرور")]
}, {
  field: "cityId",
  selector: (d) => d.cityId,
  validators: [Validators.required("يرجى اختيار المدينة")]
}, {
  field: "companyName",
  selector: (d) => d.companyName,
  validators: [Validators.required("يرجى إدخال اسم الشركة")]
}, {
  field: "email",
  selector: (d) => d.email,
  validators: [
    Validators.required("يرجى إدخال البريد الإلكتروني"),
    Validators.custom(
      (val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val as string),
      "صيغة البريد الإلكتروني غير صحيحة"
    )
  ]
}, {
  field: "branchName",
  selector: (d) => d.branchName,
  validators: [Validators.required("يرجى إدخال اسم الفرع")]
}, {
  field: "companyBusinessCategory",
  selector: (d) => d.companyBusinessCategory,
  validators: [Validators.required("يرجى إدخال نشاط الشركة")]
}, {
  field: "companyPhone",
  selector: (d) => d.companyPhone,
  validators: [Validators.required("يرجى إدخال رقم هاتف الشركة")]
}, {
  field: "crn",
  selector: (d) => d.crn,
  validators: [Validators.required("يرجى إدخال السجل التجاري")]
}, {
  field: "vatNumber",
  selector: (d) => d.vatNumber,
  validators: [Validators.required("يرجى إدخال الرقم الضريبي")]
}, {
  field: "currencyId",
  selector: (d) => d.currencyId,
  validators: [Validators.required("يرجى اختيار العملة")]
}];

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
    reset(state)
    {
      state.formData = {};
      state.currentStep = 0;
      state.loading = false;
      state.successed = false;
      state.errors = {};
      state.acceptPolicies = false;
    },
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
      })
      .addCase(registerAsync.rejected, (state) =>
      {
        state.loading = false;
        state.successed = false;
        state.currentStep = 0;
      });

    RegisterActions.addCitiesCases(builder);
    RegisterActions.addCurrenciesCases(builder);
  }
});

export const registerAsync = createAsyncThunk(
  "register/register",
  async (data: Registration, { rejectWithValue }) =>
  {
    const res = await new RegisterApiService().register(data);
    if (res.status !== 200)
    {
      return rejectWithValue(res.status);
    }
  }
);

export const {
  reset,
  citySelected,
  updateField,
  nextStep,
  prevStep,
  setErrors,
  acceptPoliciesToggle
} = registerSlice.actions;
export default registerSlice.reducer;
