import { SystemPermissions } from "yusr-ui";
import { SystemPermissionsActions } from "../../../../../packages/yusr-ui/src/auth/systemPermissionsActions";
import { SystemPermissionsResources } from "../../core/auth/systemPermissionsResources";
import { AccountType, BanksSlice } from "../../core/data/account";
import { useAppSelector } from "../../core/state/store";
import AccountsPage from "./accountsPage";

export default function BanksAccountsPage()
{
  const authState = useAppSelector((state) => state.auth);

  return (
    <AccountsPage
      slice={ BanksSlice }
      title="إدارة حسابات البنوك"
      fixedType={ AccountType.Bank }
      selectEntityState={ (state) => state.banks }
      selectDialogState={ (state) => state.banksDialog }
      selectFormState={ (state) => state.banksForm }
      hasPagePermission={ SystemPermissions.hasAuth(
        authState.loggedInUser?.role?.permissions ?? [],
        SystemPermissionsResources.AccountBank,
        SystemPermissionsActions.Get
      ) && SystemPermissions.hasAuth(
        authState.loggedInUser?.role?.permissions ?? [],
        SystemPermissionsResources.Accounts,
        SystemPermissionsActions.Get
      ) }
    />
  );
}
