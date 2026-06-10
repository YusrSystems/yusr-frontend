import { Services } from "@/core/services/services";
import { useSignals } from "@preact/signals-react/runtime";
import { useTranslation } from "react-i18next";
import { SystemPermissions, SystemPermissionsActions } from "yusr-ui";
import { SystemPermissionsResources } from "../../core/auth/systemPermissionsResources";
import { AccountType, BoxesSlice } from "../../core/data/account";
import { useAppSelector } from "../../core/state/store";
import AccountsPageOld, { AccountsPage } from "./accountsPage";

export default function BoxesAccountsPageOld()
{
  const { t } = useTranslation("accounting");
  const authState = useAppSelector((state) => state.auth);

  return (
    <AccountsPageOld
      slice={ BoxesSlice }
      title={ t("boxes.title") }
      fixedType={ AccountType.Box }
      selectEntityState={ (state) => state.boxes }
      selectDialogState={ (state) => state.boxesDialog }
      selectFormState={ (state) => state.boxesForm }
      hasPagePermission={ SystemPermissions.hasAuth(
        authState.loggedInUser?.role?.permissions ?? [],
        SystemPermissionsResources.AccountBox,
        SystemPermissionsActions.Get
      ) && SystemPermissions.hasAuth(
        authState.loggedInUser?.role?.permissions ?? [],
        SystemPermissionsResources.Accounts,
        SystemPermissionsActions.Get
      ) }
    />
  );
}

export function BoxesAccountsPage()
{
  useSignals();
  const { t } = useTranslation("accounting");
  return (
    <AccountsPage
      fixedType={ AccountType.Box }
      title={ t("boxes.title") }
      hasPagePermission={ Services.auth.hasAuth(
        SystemPermissionsResources.AccountBox,
        SystemPermissionsActions.Get
      ) && Services.auth.hasAuth(
        SystemPermissionsResources.Accounts,
        SystemPermissionsActions.Get
      ) }
    />
  );
}
