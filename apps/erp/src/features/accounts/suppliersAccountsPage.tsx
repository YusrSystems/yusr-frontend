import { SystemPermissions } from "yusr-core";
import { SystemPermissionsActions } from "../../core/auth/systemPermissionsActions";
import { SystemPermissionsResources } from "../../core/auth/systemPermissionsResources";
import { AccountType, SuppliersSlice } from "../../core/data/account";
import { useAppSelector } from "../../core/state/store";
import AccountsPage from "./accountsPage";

export default function SuppliersAccountsPage()
{
  const authState = useAppSelector((state) => state.auth);

  return (
    <AccountsPage
      title="إدارة حسابات الموردين"
      slice={ SuppliersSlice }
      fixedType={ AccountType.Supplier }
      selectEntityState={ (state) => state.suppliers }
      selectDialogState={ (state) => state.suppliersDialog }
      selectFormState={ (state) => state.suppliersForm }
      hasPagePermission={ SystemPermissions.hasAuth(
        authState.loggedInUser?.role?.permissions ?? [],
        SystemPermissionsResources.AccountSupplier,
        SystemPermissionsActions.Get
      ) && SystemPermissions.hasAuth(
        authState.loggedInUser?.role?.permissions ?? [],
        SystemPermissionsResources.Accounts,
        SystemPermissionsActions.Get
      ) }
    />
  );
}
