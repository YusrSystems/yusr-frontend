import { createGenericDialogSlice, createGenericEntitySlice, createGenericFormSlice } from "yusr-ui";
import StoreOld, { filterAll, storeService } from "./store";

export class StoreSlice
{
  private static entitySliceInstance = createGenericEntitySlice(
    "store",
    storeService,
    undefined, // filterMethod
    {}, // customReducers
    // extraActions
    (builder) =>
    {
      builder
        .addCase(filterAll.pending, (state) =>
        {
          state.isLoading = true;
        })
        .addCase(filterAll.fulfilled, (state, action) =>
        {
          state.isLoading = false;
          state.isLoaded = true;
          if (action.payload)
          {
            state.entities = action.payload as never;
          }
        })
        .addCase(filterAll.rejected, (state) =>
        {
          state.isLoading = false;
        });
    }
  );

  public static entityActions = { ...StoreSlice.entitySliceInstance.actions, filterAll };
  public static entityReducer = StoreSlice.entitySliceInstance.reducer;

  private static dialogSliceInstance = createGenericDialogSlice<StoreOld>("storeDialog");
  public static dialogActions = StoreSlice.dialogSliceInstance.actions;
  public static dialogReducer = StoreSlice.dialogSliceInstance.reducer;

  private static formSliceInstance = createGenericFormSlice<StoreOld>("storeForm");
  public static formActions = StoreSlice.formSliceInstance.actions;
  public static formReducer = StoreSlice.formSliceInstance.reducer;
}
