import AccountsApiService from "@/core/networking/accountApiService";
import { Services } from "@/core/services/services";
import { type RootState, useAppSelector } from "@/core/state/store";
import ChangeAccountDialog from "@/features/accounts/changeAccountDialog";
import type { Account, AccountDto } from "@/features/accounts/data/account";
import type { Signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import React, { useEffect, useMemo } from "react";
import { type BasicSearchableSelectParamsOld, ChangableSearchableSelect, type IEntityState, type IFormState, PageCubit, PageLoaded, PageLoading, SearchableSelect, type SearchableSelectOptionProps, type SearchableSelectProps } from "yusr-ui";
import { SystemPermissionsResources } from "../../auth/systemPermissionsResources";
import { type AccountSliceType, AccountType } from "../../data/account";

export default function AccountsSearchableSelectOld(
  {
    slice,
    selectedId,
    selectedLabel,
    selectEntityState,
    selectFormState,
    selectTypes,
    fixedType,
    disabled,
    isInvalid,
    onValueChange,
    allowAdd = true,
    allowUpdate = true,
    items,
    ...props
  }:
    & BasicSearchableSelectParamsOld<Account>
    & {
      slice: AccountSliceType;
      selectEntityState: (state: RootState) => IEntityState<Account>;
      selectFormState: (state: RootState) => IFormState<Account>;
      selectTypes?: {
        label: string;
        value: string;
      }[];
      fixedType?: AccountType;
      allowAdd?: boolean;
      allowUpdate?: boolean;
      items?: Account[];
    }
)
{
  const accountState = useAppSelector(selectEntityState) as IEntityState<Account>;
  const authState = useAppSelector((state) => state.auth);

  return (
    <ChangableSearchableSelect<Account, {
      slice: AccountSliceType;
      selectEntityState: (state: RootState) => IEntityState<Account>;
      selectFormState: (state: any) => IFormState<Account>;
      selectTypes?: {
        label: string;
        value: string;
      }[];
      fixedType?: AccountType;
      filterDataOutside?: boolean;
    }>
      labelKey="name"
      createKey="name"
      selectedId={ selectedId }
      selectedLabel={ selectedLabel }
      items={ items }
      state={ accountState }
      apiService={ new AccountsApiService() }
      disabled={ disabled }
      isInvalid={ isInvalid }
      systemPermissionsResources={ SystemPermissionsResources.Accounts }
      allowAdd={ allowAdd && !disabled }
      allowUpdate={ allowUpdate && !disabled }
      onValueChange={ onValueChange }
      entityActions={ {
        filter: slice.entityActions.filter,
        refresh: slice.entityActions.refresh
      } }
      changeDialog={ ChangeAccountDialog }
      changeDialogProps={ {
        slice: slice,
        selectEntityState: selectEntityState,
        selectFormState: selectFormState,
        selectTypes: selectTypes,
        fixedType: fixedType,
        filterDataOutside: true
      } }
      authPermissions={ authState.loggedInUser?.role?.permissions ?? [] }
      { ...props }
    />
  );
}

export function AccountsSearchableSelect(
  { type, ...props }: SearchableSelectProps<Account, AccountDto> & { type: Signal<number>; }
)
{
  useSignals();
  const cubit = useMemo(() => new PageCubit<Account, AccountDto>(Services.accountsApi), []);
  useEffect(() => cubit.init([type.value]), []);

  return (
    <SearchableSelect>
      <SearchableSelect.Trigger label={ props.label?.value } />
      <SearchableSelect.Content>
        <SearchableSelect.SearchInput onSearch={ (searchInput) => cubit.search(searchInput) } />
        <SearchableSelect.Command>
          <SearchableSelect.NullOption { ...props } />
          <CommandItems />
        </SearchableSelect.Command>
      </SearchableSelect.Content>
    </SearchableSelect>
  );

  function CommandItems()
  {
    useSignals();
    if (cubit.state.value instanceof PageLoading)
    {
      return <SearchableSelect.Loading />;
    }

    if (cubit.state.value instanceof PageLoaded && cubit.entities.value.length > 0)
    {
      return cubit.entities.value.map((entity) => <Option key={ entity.id.value } item={ entity } { ...props } />);
    }

    return <SearchableSelect.Empty />;
  }
}

const Option = React.memo(
  function Option({ ...props }: Omit<SearchableSelectOptionProps<Account, AccountDto>, "labelSelector">)
  {
    useSignals();
    return (
      <SearchableSelect.Option
        labelSelector="name"
        { ...props }
      >
        <SearchableSelect.OptionBody label={ props.item.name.value } />
      </SearchableSelect.Option>
    );
  }
);
