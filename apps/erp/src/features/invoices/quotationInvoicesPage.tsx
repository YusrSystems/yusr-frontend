//TODO: must be tested
import {SystemPermissionsResources} from "@/core/auth/systemPermissionsResources.ts";
import {InvoiceType} from "@/core/data/invoiceOld.ts";
import {Services} from "@/core/services/services.ts";
import InvoicesPage from "@/features/invoices/invoicesPage.tsx";
import {useTranslation} from "react-i18next";
import {SystemPermissionsActions} from "yusr-ui";

export default function QuotationInvoicesPage() {
    const {t} = useTranslation("accounting");
    return (
        <InvoicesPage
            permissionResource={SystemPermissionsResources.Invoices} // TODO check this for security
            entityName={t("invoices.quotation")}
            addNewItemTitle={t("invoices.addNewQuotationTitle")}
            totalInvoicesTitle={t("invoices.totalQuotations")}
            basePath="/quotations"
            title={t("invoices.quotationsManagement")}
            fixedType={InvoiceType.Quotation}
            hasPagePermission={Services.auth.hasAuth(
                SystemPermissionsResources.InvoiceSell,
                SystemPermissionsActions.Get
            ) && Services.auth.hasAuth(
                SystemPermissionsResources.Invoices,
                SystemPermissionsActions.Get
            )}
        />
    );
}
