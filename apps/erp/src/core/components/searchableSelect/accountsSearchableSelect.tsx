import AccountsApiService from "@/core/networking/accountApiService";
import { type RootState, useAppSelector } from "@/core/state/store";
import ChangeAccountDialog from "@/features/accounts/changeAccountDialog";
import { type BasicSearchableSelectParamsOld, ChangableSearchableSelect, type IEntityState, type IFormState } from "yusr-ui";
import { SystemPermissionsResources } from "../../auth/systemPermissionsResources";
import type Account from "../../data/account";
import { type AccountSliceType, AccountType } from "../../data/account";

export default function AccountsSearchableSelect(
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
