import { createSlice, type PayloadAction, type SliceCaseReducers, type ValidateSliceCaseReducers } from "@reduxjs/toolkit";
import type { IFormState } from "../interfaces/iFormState";

export function createGenericFormSlice<
  T,
  Reducer extends SliceCaseReducers<IFormState<T>> = SliceCaseReducers<IFormState<T>>
>(
  sliceName: string,
  defaultData: Partial<T> = {},
  reducers: ValidateSliceCaseReducers<IFormState<T>, Reducer> = {} as ValidateSliceCaseReducers<IFormState<T>, Reducer>
)
{
  const initialState: IFormState<T> = {
    formData: defaultData,
    errors: {},
    isDirty: false
  };

  return createSlice({
    name: sliceName,
    initialState,
    reducers: {
      setInitialData(state, action: PayloadAction<Partial<T>>)
      {
        Object.assign(state, { formData: action.payload, errors: {}, isDirty: false });
      },
      updateFormData(state, action: PayloadAction<Partial<T> | ((prev: Partial<T>) => Partial<T>)>)
      {
        const updates = typeof action.payload === "function"
          ? action.payload(state.formData as Partial<T>)
          : action.payload;
        Object.assign(state.formData as Partial<T>, updates);
        Object.keys(updates).forEach((key) =>
        {
          delete state.errors[key];
        });
        state.isDirty = true;
      },
      setErrors(state, action: PayloadAction<Record<string, string>>)
      {
        state.errors = action.payload;
      },
      clearError(state, action: PayloadAction<string>)
      {
        delete state.errors[action.payload];
      },
      resetForm(state)
      {
        Object.assign(state, { formData: defaultData, errors: {}, isDirty: false });
      },
      ...reducers
    }
  });
}
