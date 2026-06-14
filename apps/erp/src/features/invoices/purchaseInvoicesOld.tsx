import { useTranslation } from "react-i18next";
import { SystemPermissions, SystemPermissionsActions } from "yusr-ui";
import { SystemPermissionsResources } from "../../core/auth/systemPermissionsResources";
import { SuppliersSlice } from "../../core/data/accountOld";
import { InvoiceType, PurchasesSlice } from "../../core/data/invoiceOld.ts";
import { useAppSelector } from "../../core/state/store";
import InvoicesPageOld from "./invoicesPageOld.tsx";

export default function PurchaseInvoicesPage()
{
  const { t } = useTranslation("accounting");
  const authState = useAppSelector((state) => state.auth);
  const suppliersState = useAppSelector((state) => state.suppliers);

  return (
    <InvoicesPageOld
      basePath="/purchases"
      slice={ PurchasesSlice }
      stateKey="purchases"
      dialogStateKey="purchasesDialog"
      title={ t("invoices.purchasesManagement") }
      fixedType={ InvoiceType.Purchase }
      selectFormState={ (state) => state.purchasesForm }
      accountSlice={ SuppliersSlice }
      accountState={ suppliersState }
      hasPagePermission={ SystemPermissions.hasAuth(
        authState.loggedInUser?.role?.permissions ?? [],
        SystemPermissionsResources.InvoicePurchase,
        SystemPermissionsActions.Get
      ) && SystemPermissions.hasAuth(
        authState.loggedInUser?.role?.permissions ?? [],
        SystemPermissionsResources.Invoices,
        SystemPermissionsActions.Get
      ) }
    />
  );
}
