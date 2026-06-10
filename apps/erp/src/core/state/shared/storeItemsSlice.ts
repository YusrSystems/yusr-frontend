import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { ApiFilterResult, FilterByTypeRequest } from "yusr-ui";
import type ItemOld from "../../data/itemOld";
import ItemsApiServiceOld from "../../networking/itemApiServiceOld";

export interface FetchStoreItemsProps
{
  pageNumber: number;
  rowsPerPage: number;
  storeId: number | undefined;
  request: FilterByTypeRequest<ItemOld>;
}
export const fetchStoreItems = createAsyncThunk<ApiFilterResult<ItemOld>, FetchStoreItemsProps>(
  "storeItems/fetch",
  async (
    storeItemsProps: FetchStoreItemsProps
  ) =>
  {
    const res = await new ItemsApiServiceOld().FilterStoreItems(
      storeItemsProps.pageNumber,
      storeItemsProps.rowsPerPage,
      storeItemsProps.storeId,
      storeItemsProps.request
    );
    return res.data ?? { data: [], count: 0 };
  }
);

interface StoreItemsState
{
  storeItems: ItemOld[];
  isLoading: boolean;
}

const initialState: StoreItemsState = { storeItems: [], isLoading: false };

const storeItemsSlice = createSlice({
  name: "storeItems",
  initialState,
  reducers: {},
  extraReducers: (builder) =>
  {
    builder.addCase(fetchStoreItems.pending, (state) =>
    {
      state.isLoading = true;
    });
    builder.addCase(fetchStoreItems.fulfilled, (state, action) =>
    {
      state.isLoading = false;
      state.storeItems = action.payload.data ?? [];
    });
    builder.addCase(fetchStoreItems.rejected, (state) =>
    {
      state.isLoading = false;
    });
  }
});

export default storeItemsSlice.reducer;
