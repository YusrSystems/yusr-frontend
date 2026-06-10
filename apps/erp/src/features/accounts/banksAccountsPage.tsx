import { Services } from "@/core/services/services";
import { useSignals } from "@preact/signals-react/runtime";
import { useTranslation } from "react-i18next";
import { SystemPermissions, SystemPermissionsActions } from "yusr-ui";
import { SystemPermissionsResources } from "../../core/auth/systemPermissionsResources";
import { AccountType, BanksSlice } from "../../core/data/account";
import { useAppSelector } from "../../core/state/store";
import AccountsPageOld, { AccountsPage } from "./accountsPage";

export default function BanksAccountsPageOld()
{
  const { t } = useTranslation("accounting");
  const authState = useAppSelector((state) => state.auth);

  return (
    <AccountsPageOld
      slice={ BanksSlice }
      title={ t("banks.title") }
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

export function BanksAccountsPage()
{
  useSignals();
  const { t } = useTranslation("accounting");
  return (
    <AccountsPage
      title={ t("banks.title") }
      fixedType={ AccountType.Bank }
      hasPagePermission={ Services.auth.hasAuth(
        SystemPermissionsResources.AccountBank,
        SystemPermissionsActions.Get
      ) && Services.auth.hasAuth(
        SystemPermissionsResources.Accounts,
        SystemPermissionsActions.Get
      ) }
    />
  );
}
