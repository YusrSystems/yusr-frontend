import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { IDialogState } from "../interfaces/iDialogState";

export function createGenericDialogSlice<T>(sliceName: string)
{
  const initialState: IDialogState<T> = { selectedRow: null, isChangeDialogOpen: false, isDeleteDialogOpen: false };

  return createSlice({
    name: sliceName,
    initialState,
    reducers: {
      openChangeDialog: (state, action: PayloadAction<T>) =>
      {
        state.selectedRow = action.payload as any;
        state.isChangeDialogOpen = true;
      },
      openDeleteDialog: (state, action: PayloadAction<T>) =>
      {
        state.selectedRow = action.payload as any;
        state.isDeleteDialogOpen = true;
      },
      setIsChangeDialogOpen: (state, action: PayloadAction<boolean>) =>
      {
        state.isChangeDialogOpen = action.payload;
        if (!action.payload)
        {
          state.selectedRow = null as any;
        }
      },
      setIsDeleteDialogOpen: (state, action: PayloadAction<boolean>) =>
      {
        state.isDeleteDialogOpen = action.payload;
        if (!action.payload)
        {
          state.selectedRow = null as any;
        }
      }
    }
  });
}
