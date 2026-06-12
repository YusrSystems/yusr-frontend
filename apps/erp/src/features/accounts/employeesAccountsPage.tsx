import { Services } from "@/core/services/services";
import { useTranslation } from "react-i18next";
import { SystemPermissions, SystemPermissionsActions } from "yusr-ui";
import { SystemPermissionsResources } from "../../core/auth/systemPermissionsResources";
import { AccountType, EmployeesSlice } from "../../core/data/accountOld";
import { useAppSelector } from "../../core/state/store";
import AccountsPageOld, { AccountsPage } from "./accountsPage";

export default function EmployeesAccountsPageOld()
{
  const { t } = useTranslation("accounting");
  const authState = useAppSelector((state) => state.auth);

  return (
    <AccountsPageOld
      slice={ EmployeesSlice }
      title={ t("employees.title") }
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

export function EmployeesAccountsPage()
{
  const { t } = useTranslation("accounting");

  return (
    <AccountsPage
      title={ t("employees.title") }
      fixedType={ AccountType.Client }
      hasPagePermission={ Services.auth.hasAuth(
        SystemPermissionsResources.AccountEmployee,
        SystemPermissionsActions.Get
      ) && Services.auth.hasAuth(
        SystemPermissionsResources.Accounts,
        SystemPermissionsActions.Get
      ) }
    />
  );
}
