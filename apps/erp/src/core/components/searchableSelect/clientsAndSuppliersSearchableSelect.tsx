import { SystemPermissionsActions } from "@/core/auth/systemPermissionsActions";
import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources";
import Account, { AccountType, ClientsAndSuppliersSlice } from "@/core/data/account";
import { useAppSelector } from "@/core/state/store";
import { SystemPermissions } from "yusr-core";
import type { EntitySearchableSelectParams } from "yusr-ui";
import AccountsSearchableSelect from "./accountsSearchableSelect";

export default function ClientsAndSuppliersSearchableSelect(
  { id, isInvalid, onValueChange }: EntitySearchableSelectParams<Account>
)
{
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
      id={ id }
      isInvalid={ isInvalid }
      onValueChange={ (account) =>
      {
        onValueChange(account);
      } }
      slice={ ClientsAndSuppliersSlice }
      selectEntityState={ (state) => state.clientsAndSuppliers }
      selectFormState={ (state) => state.clientsAndSuppliersForm }
      selectTypes={ [
        ...(hasClientPerm ? [{ label: "عميل", value: AccountType.Client.toString() }] : []),
        ...(hasSupplierPerm
          ? [{
            label: "مورد",
            value: AccountType.Supplier.toString()
          }]
          : [])
      ] }
      allowAdd={ hasClientPerm || hasSupplierPerm }
      allowUpdate={ hasClientPerm || hasSupplierPerm }
    />
  );
}
