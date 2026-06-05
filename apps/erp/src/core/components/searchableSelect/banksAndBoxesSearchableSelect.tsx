import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources";
import Account, { AccountType, BanksAndBoxesSlice } from "@/core/data/account";
import { useAppSelector } from "@/core/state/store";
import { useTranslation } from "react-i18next";
import { type BasicSearchableSelectParamsOld, SystemPermissions, SystemPermissionsActions } from "yusr-ui";
import AccountsSearchableSelect from "./accountsSearchableSelect";

export default function BanksAndBoxesSearchableSelect(
  { ...props }: BasicSearchableSelectParamsOld<Account> & { items?: Account[]; }
)
{
  const { t } = useTranslation("accounting");
  const authState = useAppSelector((state) => state.auth);

  const hasBankPerm = SystemPermissions.hasAuth(
    authState.loggedInUser?.role?.permissions ?? [],
    SystemPermissionsResources.AccountBank,
    SystemPermissionsActions.Get
  );

  const hasBoxPerm = SystemPermissions.hasAuth(
    authState.loggedInUser?.role?.permissions ?? [],
    SystemPermissionsResources.AccountBox,
    SystemPermissionsActions.Get
  );

  return (
    <AccountsSearchableSelect
      slice={ BanksAndBoxesSlice }
      selectEntityState={ (state) => state.banksAndBoxes }
      selectFormState={ (state) => state.banksAndBoxesForm }
      selectTypes={ [
        ...(hasBankPerm ? [{ label: t("accounts.bank"), value: AccountType.Bank.toString() }] : []),
        ...(hasBoxPerm
          ? [{
            label: t("accounts.box"),
            value: AccountType.Box.toString()
          }]
          : [])
      ] }
      allowAdd={ hasBankPerm || hasBoxPerm }
      allowUpdate={ hasBankPerm || hasBoxPerm }
      { ...props }
    />
  );
}
