import { SystemPermissions } from "yusr-ui";
import { SystemPermissionsActions } from "../../../../../packages/yusr-ui/src/auth/systemPermissionsActions";
import { SystemPermissionsResources } from "../../core/auth/systemPermissionsResources";
import { AccountType, EmployeesSlice } from "../../core/data/account";
import { useAppSelector } from "../../core/state/store";
import AccountsPage from "./accountsPage";

export default function EmployeesAccountsPage()
{
  const authState = useAppSelector((state) => state.auth);

  return (
    <AccountsPage
      slice={ EmployeesSlice }
      title="إدارة حسابات الموظفين"
      fixedType={ AccountType.Employee }
      selectEntityState={ (state) => state.employees }
      selectDialogState={ (state) => state.employeesDialog }
      selectFormState={ (state) => state.employeesForm }
      hasPagePermission={ SystemPermissions.hasAuth(
        authState.loggedInUser?.role?.permissions ?? [],
        SystemPermissionsResources.AccountEmployee,
        SystemPermissionsActions.Get
      ) && SystemPermissions.hasAuth(
        authState.loggedInUser?.role?.permissions ?? [],
        SystemPermissionsResources.Accounts,
        SystemPermissionsActions.Get
      ) }
    />
  );
}
