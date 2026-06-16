import { InvoiceType } from "@/core/data/invoiceOld.ts";
import { SystemPermissionsActions } from "yusr-ui";
import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources.ts";
import InvoicePayments from "../payments/invoicePayments";
import InvoiceBasicInfo from "./invoiceBasicInfo";
import InvoiceGlobalSettlements from "./invoiceGlobalSettlements";
import InvoiceItemsTable from "./invoiceItemsTable";
import InvoiceSummary from "./invoiceSummary";
import { Services } from "@/core/services/services.ts";
import type Invoice from "@/core/data/invoices/invoice.ts";
import StoreItemSelector from "@/features/items/storeItemSelector.tsx";


export default function InvoiceBasicTab({invoice}: { invoice: Invoice })
{

	return (
		<div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-start">
			{ /* LEFT WORKSPACE */ }
			<div className="xl:col-span-8 2xl:col-span-9 space-y-4 min-w-0">
				<InvoiceBasicInfo invoice={ invoice }/>

				{ !(invoice.isDisabled || invoice.mode.value === "return") && (
					<StoreItemSelector
						storeId={ invoice.storeId }
						onSelect={ (item) => invoice.addItem(item) }
					/>
				) }

				<InvoiceItemsTable invoice={ invoice }/>
			</div>

			{ /* RIGHT SIDEBAR */ }
			<div className="xl:col-span-4 2xl:col-span-3">
				<div className="sticky top-4 space-y-4">
					{ Services.auth.hasAuth(
						SystemPermissionsResources.InvoiceAddSettlement,
						SystemPermissionsActions.Get
					) && <InvoiceGlobalSettlements invoice={ invoice }/> }

					<InvoiceSummary invoice={ invoice }/>
					{ invoice.type.value !== InvoiceType.Quotation && <InvoicePayments invoice={ invoice }/> }
				</div>
			</div>
		</div>
	);
}
