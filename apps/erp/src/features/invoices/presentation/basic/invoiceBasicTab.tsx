import { InvoiceType } from "@/core/data/invoice";
import { ItemType } from "@/core/data/itemOld";
import { SystemPermissions, SystemPermissionsActions } from "yusr-ui";
import { SystemPermissionsResources } from "../../../../core/auth/systemPermissionsResources";
import StoreItemSelectorOld from "../../../items/storeItemSelectorOld";
import { useInvoiceContext } from "../../logic/invoiceContext";
import InvoicePayments from "../payments/invoicePayments";
import InvoiceBasicInfo from "./invoiceBasicInfo";
import InvoiceGlobalSettlements from "./invoiceGlobalSettlements";
import InvoiceItemsTable from "./invoiceItemsTable";
import InvoiceSummary from "./invoiceSummary";

export default function InvoiceBasicTab()
{
  const {
    formData,
    mode,
    slice,
    authState,
    dispatch,
    disabled
  } = useInvoiceContext();

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-start">
      { /* LEFT WORKSPACE */ }
      <div className="xl:col-span-8 2xl:col-span-9 space-y-4 min-w-0">
        <InvoiceBasicInfo />

        { !(disabled || mode === "return") && (
          <StoreItemSelectorOld
            storeId={ formData.storeId }
            itemTypes={ [ItemType.Product, ItemType.Service] }
            onSelect={ (item) => dispatch(slice.formActions.addItem(item)) }
          />
        ) }

        <InvoiceItemsTable />
      </div>

      { /* RIGHT SIDEBAR */ }
      <div className="xl:col-span-4 2xl:col-span-3">
        <div className="sticky top-4 space-y-4">
          { SystemPermissions.hasAuth(
            authState.loggedInUser?.role?.permissions ?? [],
            SystemPermissionsResources.InvoiceAddSettlement,
            SystemPermissionsActions.Get
          ) && <InvoiceGlobalSettlements /> }

          <InvoiceSummary />
          { formData.type !== InvoiceType.Quotation && <InvoicePayments /> }
        </div>
      </div>
    </div>
  );
}
