//TODO: must be tested
import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources.ts";
import { Services } from "@/core/services/services.ts";
import InvoicesPage from "@/features/invoices/invoicesPage.tsx";
import { useTranslation } from "react-i18next";
import { SystemPermissionsActions } from "yusr-ui";
import { InvoiceType } from "@/core/types/invoiceType.ts";


export default function SellInvoicesPageOld()
{
	const {t} = useTranslation("accounting");

	return (
		<InvoicesPage
			permissionResource={ SystemPermissionsResources.Invoices }

			basePath="/sales"
			title={ t("invoices.salesManagement") }
			fixedType={ InvoiceType.Sell }
			filterTypes={ [InvoiceType.Sell, InvoiceType.SellReturn] }
			hasPagePermission={ Services.auth.hasAuth(
				SystemPermissionsResources.InvoiceSell,
				SystemPermissionsActions.Get
			) && Services.auth.hasAuth(
				SystemPermissionsResources.Invoices,
				SystemPermissionsActions.Get
			) }
		/>
	);
}
