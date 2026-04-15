import { type CaseReducerActions, createAsyncThunk, createSlice, type PayloadAction, type SliceCaseReducers } from "@reduxjs/toolkit";
import type { BaseEntity, BaseFilterableApiService, FilterCondition, FilterResult, RequestResult } from "yusr-core";
import { castDraft } from "immer";
import type { IEntityState } from "../interfaces/iEntityState";

type FilterMethodType<T> = (
  pageNumber: number,
  rowsPerPage: number,
  condition?: FilterCondition | undefined,
  filterTypes?: number[]
) => Promise<RequestResult<FilterResult<T>>> | undefined;

export function createGenericEntitySlice<
  T extends BaseEntity,
  CR extends SliceCaseReducers<IEntityState<T>> = {}
>(sliceName: string, service: BaseFilterableApiService<T>, filterMethod?: FilterMethodType<T>, customReducers?: CR)
{
  const initialState: IEntityState<T> = {
    entities: { data: [], count: 0 },
    isLoaded: false,
    isLoading: false,
    currentPage: 1,
    rowsPerPage: 100
  };

  const filter = createAsyncThunk(`${sliceName}/filter`, async (condition: FilterCondition | undefined, { getState }) =>
  {
    const state = (getState() as never)[sliceName] as IEntityState<T>;

    let result;
    if (filterMethod)
    {
      result = await filterMethod(state.currentPage, state.rowsPerPage, condition,  state.filterTypes);
    }
    else
    {
      result = await service.Filter(state.currentPage, state.rowsPerPage, condition);
    }

    return result?.data;
  });

  const slice = createSlice({
    name: sliceName,
    initialState,
    reducers: {
      setFilterTypes: (state, action: PayloadAction<number[]>) => {
        state.filterTypes = action.payload;
      },
      setCurrentPage: (state, action: PayloadAction<number>) =>
      {
        state.currentPage = action.payload;
      },
      refresh: (state, action: PayloadAction<{ data?: T; deletedId?: number; }>) =>
      {
        const { data, deletedId } = action.payload;
        if (deletedId)
        {
          state.entities.count -= 1;
          state.entities.data = state.entities.data?.filter((b: { id: number; }) => b.id !== deletedId);
        }
        else if (data)
        {
          const index = state.entities.data?.findIndex((b: { id: number; }) => b.id === data.id);
          if (index !== undefined && index !== -1)
          {
            if (state.entities.data)
            {
              state.entities.data[index] = castDraft(data);
            }
          }
          else
          {
            state.entities.count += 1;
            state.entities.data = [castDraft(data), ...(state.entities.data ?? [])];
          }
        }
      },
      ...(customReducers || {})
    },
    extraReducers: (builder) =>
    {
      builder.addCase(filter.pending, (state) =>
      {
        state.isLoading = true;
      }).addCase(filter.fulfilled, (state, action) =>
      {
        state.isLoading = false;
        state.isLoaded = true;
        if (action.payload)
        {
          state.entities = action.payload as never;
        }
      }).addCase(filter.rejected, (state) =>
      {
        state.isLoading = false;
      });
    }
  });

  return {
    reducer: slice.reducer,
    actions: { ...slice.actions, filter } as
      & CaseReducerActions<
        { 
          setCurrentPage: typeof slice.caseReducers.setCurrentPage;
          setFilterTypes: typeof slice.caseReducers.setFilterTypes;
          refresh: typeof slice.caseReducers.refresh; 
        } & CR,
        string
      >
      & { filter: typeof filter; }
  };
}
