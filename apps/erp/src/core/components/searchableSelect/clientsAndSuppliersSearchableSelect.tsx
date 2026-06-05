import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources";
import Account, { AccountType, ClientsAndSuppliersSlice } from "@/core/data/account";
import { useAppSelector } from "@/core/state/store";
import { useTranslation } from "react-i18next";
import type { BasicSearchableSelectParamsOld } from "yusr-ui";
import { SystemPermissions, SystemPermissionsActions } from "yusr-ui";
import AccountsSearchableSelect from "./accountsSearchableSelect";

export default function ClientsAndSuppliersSearchableSelect(
  { ...props }: BasicSearchableSelectParamsOld<Account>
)
{
  const { t } = useTranslation("accounting");
  const authState = useAppSelector((state) => state.auth);

  const hasClientPerm = SystemPermissions.hasAuth(
    authState.loggedInUser?.role?.permissions ?? [],
    SystemPermissionsResources.AccountClient,
    SystemPermissionsActions.Get
  );

  const hasSupplierPerm = SystemPermissions.hasAuth(
    authState.loggedInUser?.role?.permissions ?? [],
    SystemPermissionsResources.AccountSupplier,
    SystemPermissionsActions.Get
  );

  return (
    <AccountsSearchableSelect
      slice={ ClientsAndSuppliersSlice }
      selectEntityState={ (state) => state.clientsAndSuppliers }
      selectFormState={ (state) => state.clientsAndSuppliersForm }
      selectTypes={ [
        ...(hasClientPerm ? [{ label: t("accounts.client"), value: AccountType.Client.toString() }] : []),
        ...(hasSupplierPerm
          ? [{
            label: t("accounts.supplier"),
            value: AccountType.Supplier.toString()
          }]
          : [])
      ] }
      allowAdd={ hasClientPerm || hasSupplierPerm }
      allowUpdate={ hasClientPerm || hasSupplierPerm }
      { ...props }
    />
  );
}
