import { Services } from "@/core/services/services";
import { useTranslation } from "react-i18next";
import { SystemPermissions, SystemPermissionsActions } from "yusr-ui";
import { SystemPermissionsResources } from "../../core/auth/systemPermissionsResources";
import { AccountType, SuppliersSlice } from "../../core/data/accountOld";
import { useAppSelector } from "../../core/state/store";
import AccountsPageOld, { AccountsPage } from "./accountsPage";

export default function SuppliersAccountsPageOld()
{
  const { t } = useTranslation("accounting");
  const authState = useAppSelector((state) => state.auth);

  return (
    <AccountsPageOld
      title={ t("suppliers.title") }
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

export function SuppliersAccountsPage()
{
  const { t } = useTranslation("accounting");

  return (
    <AccountsPage
      title={ t("suppliers.title") }
      fixedType={ AccountType.Supplier }
      hasPagePermission={ Services.auth.hasAuth(
        SystemPermissionsResources.AccountSupplier,
        SystemPermissionsActions.Get
      ) && Services.auth.hasAuth(
        SystemPermissionsResources.Accounts,
        SystemPermissionsActions.Get
      ) }
    />
  );
}
