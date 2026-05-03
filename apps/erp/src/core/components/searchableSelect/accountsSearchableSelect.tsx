import AccountsApiService from "@/core/networking/accountApiService";
import { type RootState, useAppSelector } from "@/core/state/store";
import ChangeAccountDialog from "@/features/accounts/changeAccountDialog";
import type { EntitySearchableSelectParams, FormState, IEntityState } from "yusr-ui";
import ChangableSearchableSelect from "../../../../../../packages/yusr-ui/src/components/custom/select/changableSearchableSelect";
import { SystemPermissionsResources } from "../../auth/systemPermissionsResources";
import type Account from "../../data/account";
import { AccountFilterColumns, type AccountSliceType, AccountType } from "../../data/account";

export default function AccountsSearchableSelect(
  {
    id,
    slice,
    selectEntityState,
    selectFormState,
    selectTypes,
    fixedType,
    disabled,
    isInvalid,
    onValueChange,
    allowAdd = true,
    allowUpdate = true,
    items = undefined
  }:
    & EntitySearchableSelectParams<Account>
    & {
      slice: AccountSliceType;
      selectEntityState: (state: RootState) => IEntityState<Account>;
      selectFormState: (state: RootState) => FormState<Account>;
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

  return (
    <ChangableSearchableSelect<Account, {
      slice: AccountSliceType;
      selectEntityState: (state: RootState) => IEntityState<Account>;
      selectFormState: (state: any) => FormState<Account>;
      selectTypes?: {
        label: string;
        value: string;
      }[];
      fixedType?: AccountType;
      filterDataOutside?: boolean;
    }>
      id={ id }
      items={ items }
      itemLabelKey="name"
      itemValueKey="id"
      state={ accountState }
      apiService={ new AccountsApiService() }
      columnsNames={ AccountFilterColumns.columnsNames }
      disabled={ disabled }
      isInvalid={ isInvalid }
      systemPermissionsResources={ SystemPermissionsResources.Accounts }
      allowAdd={ allowAdd }
      allowUpdate={ allowUpdate }
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
    />
  );
}
