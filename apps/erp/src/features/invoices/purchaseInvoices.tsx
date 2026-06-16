//TODO: must be tested
import {SystemPermissionsResources} from "@/core/auth/systemPermissionsResources.ts";
import {InvoiceType} from "@/core/data/invoiceOld.ts";
import {Services} from "@/core/services/services.ts";
import InvoicesPage from "@/features/invoices/invoicesPage.tsx";
import {useTranslation} from "react-i18next";
import {SystemPermissionsActions} from "yusr-ui";

export default function PurchaseInvoicesPage() {
    const {t} = useTranslation("accounting");

    return (
        <InvoicesPage
            permissionResource={SystemPermissionsResources.InvoicePurchase}
            basePath="/purchases"
            title={t("invoices.purchasesManagement")}
            fixedType={InvoiceType.Purchase}
            hasPagePermission={Services.auth.hasAuth(
                SystemPermissionsResources.InvoicePurchase,
                SystemPermissionsActions.Get
            ) && Services.auth.hasAuth(
                SystemPermissionsResources.Invoices,
                SystemPermissionsActions.Get
            )}
        />
    );
}
