import { useTranslation } from "react-i18next";
import { SystemPermissions, SystemPermissionsActions } from "yusr-ui";
import { SystemPermissionsResources } from "../../core/auth/systemPermissionsResources";
import { AccountType, BoxesSlice } from "../../core/data/account";
import { useAppSelector } from "../../core/state/store";
import AccountsPage from "./accountsPage";

export default function BoxesAccountsPage()
{
  const { t } = useTranslation("accounting");
  const authState = useAppSelector((state) => state.auth);

  return (
    <AccountsPage
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
