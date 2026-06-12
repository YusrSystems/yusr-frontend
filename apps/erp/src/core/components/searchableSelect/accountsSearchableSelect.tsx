import type { Account, AccountDto } from "@/core/data/account";
import AccountsApiServiceOld from "@/core/networking/accountApiServiceOld";
import { Cubits } from "@/core/services/cubits";
import { type RootState, useAppSelector } from "@/core/state/store";
import { useSignals } from "@preact/signals-react/runtime";
import React, { useEffect } from "react";
import { type BasicSearchableSelectParamsOld, ChangableSearchableSelect, type IEntityState, type IFormState, PageLoaded, PageLoading, SearchableSelect, type SearchableSelectOptionProps, type SearchableSelectProps } from "yusr-ui";
import { SystemPermissionsResources } from "../../auth/systemPermissionsResources";
import AccountOld, { type AccountSliceType, AccountType } from "../../data/accountOld";

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
    & BasicSearchableSelectParamsOld<AccountOld>
    & {
      slice: AccountSliceType;
      selectEntityState: (state: RootState) => IEntityState<AccountOld>;
      selectFormState: (state: RootState) => IFormState<AccountOld>;
      selectTypes?: {
        label: string;
        value: string;
      }[];
      fixedType?: AccountType;
      allowAdd?: boolean;
      allowUpdate?: boolean;
      items?: AccountOld[];
    }
)
{
  const accountState = useAppSelector(selectEntityState) as IEntityState<AccountOld>;
  const authState = useAppSelector((state) => state.auth);

  return (
    <ChangableSearchableSelect<AccountOld, {
      slice: AccountSliceType;
      selectEntityState: (state: RootState) => IEntityState<AccountOld>;
      selectFormState: (state: any) => IFormState<AccountOld>;
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
      apiService={ new AccountsApiServiceOld() }
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
  { types, ...props }: SearchableSelectProps<Account, AccountDto> & { types: number[]; }
)
{
  useSignals();
  useEffect(() => Cubits.accounts.init(types), []);

  return (
    <SearchableSelect>
      <SearchableSelect.Trigger label={ props.label } disabled={ props.disabled } />
      <SearchableSelect.Content>
        <SearchableSelect.SearchInput onSearch={ (searchInput) => Cubits.accounts.search(searchInput) } />
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
    if (Cubits.accounts.state.value instanceof PageLoading)
    {
      return <SearchableSelect.Loading />;
    }

    if (Cubits.accounts.state.value instanceof PageLoaded && Cubits.accounts.entities.value.length > 0)
    {
      return Cubits.accounts.entities.value.map((entity) => <Option key={ entity.id.value } item={ entity } { ...props } />);
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
