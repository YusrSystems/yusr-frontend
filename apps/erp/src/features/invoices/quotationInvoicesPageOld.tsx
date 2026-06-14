import { useTranslation } from "react-i18next";
import { SystemPermissions, SystemPermissionsActions } from "yusr-ui";
import { SystemPermissionsResources } from "../../core/auth/systemPermissionsResources";
import { ClientsSlice } from "../../core/data/accountOld";
import { InvoiceType, QuotationSlice } from "../../core/data/invoiceOld.ts";
import { useAppSelector } from "../../core/state/store";
import InvoicesPageOld from "./invoicesPageOld.tsx";

export default function QuotationInvoicesPageOld()
{
  const { t } = useTranslation("accounting");
  const authState = useAppSelector((state) => state.auth);
  const clientsState = useAppSelector((state) => state.clients);

  return (
    <InvoicesPageOld
      entityName={ t("invoices.quotation") }
      addNewItemTitle={ t("invoices.addNewQuotationTitle") }
      totalInvoicesTitle={ t("invoices.totalQuotations") }
      basePath="/quotations"
      slice={ QuotationSlice }
      stateKey="quotations"
      dialogStateKey="quotationsDialog"
      title={ t("invoices.quotationsManagement") }
      fixedType={ InvoiceType.Quotation }
      selectFormState={ (state) => state.quotationsForm }
      accountSlice={ ClientsSlice }
      accountState={ clientsState }
      hasPagePermission={ SystemPermissions.hasAuth(
        authState.loggedInUser?.role?.permissions ?? [],
        SystemPermissionsResources.InvoiceSell,
        SystemPermissionsActions.Get
      ) && SystemPermissions.hasAuth(
        authState.loggedInUser?.role?.permissions ?? [],
        SystemPermissionsResources.Invoices,
        SystemPermissionsActions.Get
      ) }
    />
  );
}
