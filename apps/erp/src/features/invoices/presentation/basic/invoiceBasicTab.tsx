import {InvoiceType} from "@/core/data/invoiceOld.ts";
import {SystemPermissionsActions} from "yusr-ui";
import {SystemPermissionsResources} from "@/core/auth/systemPermissionsResources.ts";
import InvoicePayments from "../payments/invoicePayments";
import InvoiceBasicInfo from "./invoiceBasicInfo";
import InvoiceGlobalSettlements from "./invoiceGlobalSettlements";
import InvoiceItemsTable from "./invoiceItemsTable";
import InvoiceSummary from "./invoiceSummary";
import {Services} from "@/core/services/services.ts";
import type Invoice from "@/core/data/invoice.ts";
import StoreItemSelector from "@/features/items/storeItemSelector.tsx";
import type Item from "@/core/data/item.ts";
import {InvoiceItem} from "@/core/data/invoiceItem.ts";

export default function InvoiceBasicTab({entity}: { entity: Invoice }) {

    const addItem = (invoice: Invoice, storeItem: Item) => {
        const existingItem = invoice.invoiceItems.value?.find((item) => item.itemId.value === storeItem.id.value);

        if (existingItem) {
            return existingItem.incrementQuantity();
        }

        const newInvoiceItem = InvoiceItem.createFromItem(invoice, storeItem);
        invoice.invoiceItems.value = [...invoice.invoiceItems.value, newInvoiceItem];

        if (invoice.settlementPercent.value) {
            invoice.changeSettlementPercent(invoice.settlementPercent.value);
        }

        if (invoice.settlementAmount.value) {
            invoice.changeSettlementPercent(invoice.settlementAmount.value);
        }
    }

    return (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-start">
            { /* LEFT WORKSPACE */}
            <div className="xl:col-span-8 2xl:col-span-9 space-y-4 min-w-0">
                <InvoiceBasicInfo/>

                {!(entity.isDisabled || entity.mode.value === "return") && (
                    <StoreItemSelector
                        storeId={entity.storeId}
                        onSelect={(item) => addItem(entity, item)}
                    />
                )}

                <InvoiceItemsTable/>
            </div>

            { /* RIGHT SIDEBAR */}
            <div className="xl:col-span-4 2xl:col-span-3">
                <div className="sticky top-4 space-y-4">
                    {Services.auth.hasAuth(
                        SystemPermissionsResources.InvoiceAddSettlement,
                        SystemPermissionsActions.Get
                    ) && <InvoiceGlobalSettlements/>}

                    <InvoiceSummary/>
                    {formData.type !== InvoiceType.Quotation && <InvoicePayments/>}
                </div>
            </div>
        </div>
    );
}
