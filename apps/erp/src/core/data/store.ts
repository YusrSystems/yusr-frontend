import { createAsyncThunk } from "@reduxjs/toolkit";
import { type TFunction } from "i18next";
import { BaseEntity, createGenericDialogSlice, createGenericEntitySlice, createGenericFormSlice, type IEntityState, type ValidationRuleOld, Validators } from "yusr-ui";
import StoresApiService from "../networking/storeApiService";

export default class Store extends BaseEntity
{
  public name!: string;
  public createdBy!: number;
  public authorized!: boolean;

  constructor(init?: Partial<Store>)
  {
    super();
    Object.assign(this, init);
  }
}

export class StoreValidationRules
{
  public static validationRules = (t: TFunction<"stocking">): ValidationRuleOld<Partial<Store>>[] => [{
    field: "name",
    selector: (d) => d.name,
    validators: [Validators.required(t("stores.nameRequired"))]
  }];
}

const storeService = new StoresApiService();

const filterAll = createAsyncThunk(
  "store/filterAll",
  async (searchText: string | undefined, { getState }) =>
  {
    const state = (getState() as never)["store"] as IEntityState<Store>;
    const result = await storeService.FilterAll(state.currentPage, state.rowsPerPage, searchText);
    return result?.data;
  }
);

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

  private static dialogSliceInstance = createGenericDialogSlice<Store>("storeDialog");
  public static dialogActions = StoreSlice.dialogSliceInstance.actions;
  public static dialogReducer = StoreSlice.dialogSliceInstance.reducer;

  private static formSliceInstance = createGenericFormSlice<Store>("storeForm");
  public static formActions = StoreSlice.formSliceInstance.actions;
  public static formReducer = StoreSlice.formSliceInstance.reducer;
}
