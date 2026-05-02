import { SystemPermissions } from "yusr-core";
import { SystemPermissionsActions } from "../../core/auth/systemPermissionsActions";
import { SystemPermissionsResources } from "../../core/auth/systemPermissionsResources";
import { AccountType, ClientsSlice } from "../../core/data/account";
import { useAppSelector } from "../../core/state/store";
import AccountsPage from "./accountsPage";

export default function ClientsAccountsPage()
{
  const authState = useAppSelector((state) => state.auth);

  return (
    <AccountsPage
      title="إدارة حسابات العملاء"
      slice={ ClientsSlice }
      fixedType={ AccountType.Client }
      selectEntityState={ (state) => state.clients }
      selectDialogState={ (state) => state.clientsDialog }
      selectFormState={ (state) => state.clientsForm }
      hasPagePermission={ SystemPermissions.hasAuth(
        authState.loggedInUser?.role?.permissions ?? [],
        SystemPermissionsResources.AccountClient,
        SystemPermissionsActions.Get
      ) && SystemPermissions.hasAuth(
        authState.loggedInUser?.role?.permissions ?? [],
        SystemPermissionsResources.Accounts,
        SystemPermissionsActions.Get
      ) }
    />
  );
}
