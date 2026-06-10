import { Services } from "@/core/services/services";
import { useTranslation } from "react-i18next";
import { SystemPermissions, SystemPermissionsActions } from "yusr-ui";
import { SystemPermissionsResources } from "../../core/auth/systemPermissionsResources";
import { AccountType, ClientsSlice } from "../../core/data/account";
import { useAppSelector } from "../../core/state/store";
import AccountsPageOld, { AccountsPage } from "./accountsPage";

export default function ClientsAccountsPageOld()
{
  const { t } = useTranslation("accounting");
  const authState = useAppSelector((state) => state.auth);

  return (
    <AccountsPageOld
      title={ t("clients.title") }
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

export function ClientsAccountsPage()
{
  const { t } = useTranslation("accounting");

  return (
    <AccountsPage
      title={ t("clients.title") }
      fixedType={ AccountType.Client }
      hasPagePermission={ SystemPermissions.hasAuth(
        Services.auth.loggedInUser?.role?.value.permissions ?? [],
        SystemPermissionsResources.AccountClient,
        SystemPermissionsActions.Get
      ) && SystemPermissions.hasAuth(
        Services.auth.loggedInUser?.role?.value.permissions ?? [],
        SystemPermissionsResources.Accounts,
        SystemPermissionsActions.Get
      ) }
    />
  );
}
