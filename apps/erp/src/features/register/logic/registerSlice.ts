import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type TFunction } from "i18next";
import { type ValidationRuleOld, Validators } from "yusr-ui";
import type RegistrationOld from "../../../core/data/registration";
import RegisterApiServiceOld from "../../../core/networking/registerApiService";

export interface RegisterState
{
  formData: Partial<RegistrationOld>;
  currentStep: number;
  loading: boolean;
  successed: boolean;
  errors: Partial<Record<keyof RegistrationOld, string>>;
  acceptPolicies?: boolean;
}

export const getValidationRules = (t: TFunction<"loginRegister">): ValidationRuleOld<Partial<RegistrationOld>>[] => [{
  field: "username",
  selector: (d) => d.username,
  validators: [Validators.required(t("register.accountInfo.username.required"))]
}, {
  field: "userPassword",
  selector: (d) => d.userPassword,
  validators: [Validators.required(t("register.accountInfo.password.required"))]
}, {
  field: "cityId",
  selector: (d) => d.cityId,
  validators: [Validators.required(t("register.addressInfo.city.required"))]
}, {
  field: "companyName",
  selector: (d) => d.companyName,
  validators: [Validators.required(t("register.companyInfo.companyName.required"))]
}, {
  field: "email",
  selector: (d) => d.email,
  validators: [
    Validators.required(t("register.companyInfo.email.required")),
    Validators.custom(
      (val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val as string),
      t("register.companyInfo.email.invalid")
    )
  ]
}, {
  field: "branchName",
  selector: (d) => d.branchName,
  validators: [Validators.required(t("register.companyInfo.branchName.required"))]
}, {
  field: "companyBusinessCategory",
  selector: (d) => d.companyBusinessCategory,
  validators: [Validators.required(t("register.companyInfo.companyBusinessCategory.required"))]
}, {
  field: "companyPhone",
  selector: (d) => d.companyPhone,
  validators: [Validators.required(t("register.companyInfo.companyPhone.required"))]
}, {
  field: "crn",
  selector: (d) => d.crn,
  validators: [Validators.required(t("register.companyInfo.crn.required"))]
}, {
  field: "vatNumber",
  selector: (d) => d.vatNumber,
  validators: [Validators.required(t("register.companyInfo.vatNumber.required"))]
}, {
  field: "currencyId",
  selector: (d) => d.currencyId,
  validators: [Validators.required(t("register.companyInfo.currency.required"))]
}];

const initialState: RegisterState = {
  formData: {},
  currentStep: 0,
  loading: false,
  successed: false,
  errors: {},
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
    updateField(state, action: PayloadAction<Partial<RegistrationOld>>)
    {
      state.formData = { ...state.formData, ...action.payload };
      Object.keys(action.payload).forEach((key) =>
      {
        const fieldKey = key as keyof RegistrationOld;
        if (state.errors[fieldKey])
        {
          delete state.errors[fieldKey];
        }
      });
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
      action: PayloadAction<Partial<Record<keyof RegistrationOld, string>>>
    )
    {
      state.errors = action.payload;
    },
    acceptPoliciesToggle(state)
    {
      state.acceptPolicies = !state.acceptPolicies;
    },
    setStep(state, action: PayloadAction<number>)
    {
      state.currentStep = action.payload;
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
        const emailStorageItemName = "remembered_email";
        const usernameStorageItemName = "remembered_username";

        localStorage.setItem(emailStorageItemName, state.formData.email || "");
        localStorage.setItem(usernameStorageItemName, state.formData.username || "");
      })
      .addCase(registerAsync.rejected, (state) =>
      {
        state.loading = false;
        state.successed = false;
        state.currentStep = 0;
      });
  }
});

export const registerAsync = createAsyncThunk(
  "register/register",
  async (data: RegistrationOld, { rejectWithValue }) =>
  {
    const res = await new RegisterApiServiceOld().register(data);
    if (res.status !== 200)
    {
      return rejectWithValue(res.status);
    }
  }
);

export const {
  reset,
  updateField,
  nextStep,
  prevStep,
  setErrors,
  acceptPoliciesToggle,
  setStep
} = registerSlice.actions;
export default registerSlice.reducer;
