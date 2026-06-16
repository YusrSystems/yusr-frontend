import VerfiAccountWrapper from "@/core/components/VerfiAccountWrapper.tsx";
import {InvoiceDto} from "@/core/data/invoice.ts";
import Invoice from "@/core/data/invoice.ts";
import {EInvoiceStatus} from "@/core/data/invoiceOld.ts";
import {InvoiceStatus} from "@/core/data/invoiceOld.ts";
import {InvoiceType} from "@/core/data/invoiceOld.ts";
import {InvoicesListReportType} from "@/core/data/report/invoicesListReportType.ts";
import type {InvoicesListReportRequest} from "@/core/data/report/invoicesListReportType.ts";
import ReportConstants from "@/core/data/report/reportConstants.ts";
import {EInvoicingEnvironmentType} from "@/core/data/settingOld.ts";
import {Cubits} from "@/core/services/cubits";
import {Services} from "@/core/services/services";
import ChangeInvoiceDialog from "@/features/invoices/changeInvoiceDialog.tsx";
import ReportButton from "@/features/reports/reportButton.tsx";
import {signal} from "@preact/signals-react";
import {useSignals} from "@preact/signals-react/runtime";
import type {TFunction} from "i18next";
import {RotateCw} from "lucide-react";
import {FileTextIcon} from "lucide-react";
import {useMemo} from "react";
import {useEffect} from "react";
import {useTranslation} from "react-i18next";
import {TooltipContent} from "yusr-ui";
import {Button} from "yusr-ui";
import {TooltipTrigger} from "yusr-ui";
import {Tooltip} from "yusr-ui";
import {CurrencyIcon} from "yusr-ui";
import type {TableBodyRowInfo} from "yusr-ui";
import {
    CrudPage,
    PageError,
    PageLoaded,
    PageLoading,
    SystemPermissionsActions,
    TablePreview,
    UnauthorizedPage
} from "yusr-ui";
import {SystemPermissionsResources} from "../../core/auth/systemPermissionsResources";

export default function InvoicesPage({
                                         entityName,
                                         addNewItemTitle,
                                         totalInvoicesTitle,
                                         title,
                                         fixedType,
                                         hasPagePermission,
                                         basePath,
                                         permissionResource
                                     }: {
    entityName?: string;
    addNewItemTitle?: string;
    totalInvoicesTitle?: string;
    title: string;
    fixedType: InvoiceType;
    hasPagePermission: boolean;
    basePath?: string;
    permissionResource: string;
}) {
    useSignals();
    useEffect(() => Cubits.invoices.init(), []);
    const {t} = useTranslation("accounting");

    if (!hasPagePermission) {
        return <UnauthorizedPage/>;
    }


    return (
        <VerfiAccountWrapper>
            <CrudPage>
                <CrudPage.Header
                    title={title}
                    addButtonTitle={t("invoices.addNewTitle")}
                    isAddButtonVisible={Services.auth.hasAuth(
                        SystemPermissionsResources.Invoices,
                        SystemPermissionsActions.Add
                    )}
                    actionButtons={
                        Services.auth.hasAuth(
                            SystemPermissionsResources.ReportInvoiceList,
                            SystemPermissionsActions.Get
                        )
                            ? [<InvoicesReportButton fixedType={fixedType}/>]
                            : []
                    }
                />
                <Cards totalInvoicesTitle={totalInvoicesTitle}/>

                <CrudPage.SearchInput onSearch={(searchText) => Cubits.invoices.search(searchText)}/>

                <PageTable fixedType={fixedType} permissionResource={permissionResource}/>

                <CrudPage.ChangeDialog
                    changeDialog={(dto: InvoiceDto | undefined, closeDialog) => {
                        return (
                            <ChangeInvoiceDialog
                                entity={dto
                                    ? Invoice.load(dto)
                                    : Invoice.create()}
                                service={Services.invoicesApi}
                                onSuccess={(data: Invoice) => {
                                    if (data.mode.value === "create") {
                                        Cubits.invoices.add(data);
                                        closeDialog();
                                    } else if (data.mode.value === "update") {
                                        Cubits.invoices.update(data);
                                    }
                                }}
                            />
                        );
                    }}
                />

                {/*<CrudPage.DeleteDialog*/}
                {/*    entityNameSelector={(invoice: Invoice) => invoice.name}*/}
                {/*    service={Services.invoicesApi}*/}
                {/*    onSuccess={(entity) => Cubits.invoices.delete(entity)}*/}
                {/*/>*/}
            </CrudPage>
        </VerfiAccountWrapper>
    );
}

function Cards({totalInvoicesTitle}: { totalInvoicesTitle?: string }) {
    useSignals();
    const {t} = useTranslation("accounting");
    return (
        <CrudPage.Cards
            cards={[{
                title: totalInvoicesTitle ?? t("invoices.totalInvoices"),
                data: (Cubits.invoices.count.value ?? 0).toString(),
                icon: <FileTextIcon className="h-4 w-4 text-muted-foreground"/>
            }]}
        />
    );
}

function PageTable({fixedType, permissionResource}: { fixedType: InvoiceType, permissionResource: string }) {
    useSignals();
    const resendingEInvoice = useMemo(() => signal(false), [])
    const {t} = useTranslation(["accounting", "common"]);

    if (Cubits.pricingMethods.state.value instanceof PageLoading) {
        return <TablePreview.Loading/>;
    }
    const getTableHeadRows = () => {
        const rows = [{rowBody: "", rowStyles: "text-left w-12.5"}, {
            rowBody: t("invoices.invoiceId"),
            rowStyles: "w-24"
        }];

        if (fixedType === InvoiceType.Quotation) {
            rows.push({rowBody: t("invoices.notes"), rowStyles: "w-32"});
        } else {
            rows.push({rowBody: t("invoices.type"), rowStyles: "w-32"});
        }

        rows.push(
            {rowBody: t("invoices.date"), rowStyles: "w-32"},
            {rowBody: t("invoices.account"), rowStyles: "w-48"},
            {rowBody: t("invoices.store"), rowStyles: "w-32"},
            {rowBody: t("invoices.total"), rowStyles: "w-32"}
        );

        if (fixedType === InvoiceType.Sell) {
            rows.push(
                {rowBody: t("invoices.status"), rowStyles: "w-32"},
                {rowBody: "", rowStyles: "w-32"}
            );
        }

        if (
            Services.auth.setting?.eInvoicingEnvironmentType.value !== EInvoicingEnvironmentType.NotRegistered
            && fixedType === InvoiceType.Sell
        ) {
            rows.push({rowBody: t("invoices.eInvoiceStatus"), rowStyles: "w-50"});
        }

        if (
            Services.auth.hasAuth(
                SystemPermissionsResources.ReportInvoice,
                SystemPermissionsActions.Get
            )
        ) {
            rows.push({rowBody: "", rowStyles: "w-32"});
        }

        return rows;
    };

    const getPaymentStatus = (invoice: Invoice): { message: string; styles: string; } => {
        if (invoice.paidAmount.value === 0) {
            return {message: t("invoices.notPaid"), styles: "bg-red-100 text-red-800"};
        }

        if (invoice.paidAmount.value === invoice.fullAmount.value) {
            return {message: t("invoices.fullyPaid"), styles: "bg-green-100 text-green-800"};
        }

        if (invoice.paidAmount.value > invoice.fullAmount.value) {
            return {message: t("invoices.overpaid"), styles: "bg-red-100 text-red-800"};
        }

        return {
            message: t("invoices.partiallyPaid", {
                amount: invoice.paidAmount.value,
                currency: Services.auth.setting?.currency?.value.code.value
            }),
            styles: "bg-orange-100 text-orange-800"
        };
    };

    const getEInvoiceStatus = (invoice: Invoice): { message: string; styles: string; } => {
        if (
            Services.auth.setting?.eInvoicingEnvironmentType.value === EInvoicingEnvironmentType.NotRegistered
            || invoice.statusId.value !== InvoiceStatus.Valid
            || (invoice.type.value !== InvoiceType.Sell && invoice.type.value !== InvoiceType.SellReturn)
        ) {
            return {message: "", styles: ""};
        }

        if (invoice.eInvoiceStatus.value === EInvoiceStatus.NotSent) {
            return {message: t("invoices.notSent"), styles: "bg-red-100 text-red-800"};
        }

        if (invoice.eInvoiceStatus.value === EInvoiceStatus.SentWithWarnings) {
            return {message: t("invoices.sentWithWarnings"), styles: "bg-orange-100 text-orange-800"};
        }

        if (invoice.eInvoiceStatus.value === EInvoiceStatus.SentCorrectly) {
            return {message: t("invoices.sent"), styles: "bg-green-100 text-green-800"};
        }

        return {message: "", styles: ""};
    };
    const getTableRowMapper = (invoice: Invoice) => {
        const cells: TableBodyRowInfo[] = [{rowName: `#${invoice.id}`, rowStyles: ""}];

        if (fixedType === InvoiceType.Quotation) {
            cells.push({rowName: invoice.notes, rowStyles: "font-semibold"});
        } else {
            cells.push({rowName: getInvoiceTypeName(invoice.type.value, t), rowStyles: "font-semibold"});
        }

        cells.push(
            {rowName: new Date(invoice.date.value).toLocaleDateString("en-CA"), rowStyles: ""},
            {rowName: invoice.actionAccountName || "-", rowStyles: ""},
            {rowName: invoice.storeName || "-", rowStyles: ""},
            {
                rowName: (
                    <div className="flex items-center gap-1">
                        {(invoice.fullAmount ?? 0).toLocaleString("en-US")}
                        <CurrencyIcon/>
                    </div>
                ),
                rowStyles: "font-bold text-blue-600"
            }
        );

        if (fixedType === InvoiceType.Sell) {
            cells.push(
                {
                    rowName: invoice.statusId.value === InvoiceStatus.Valid
                        ? t("invoices.valid")
                        : t("invoices.deleted"),
                    rowStyles: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        invoice.statusId.value === InvoiceStatus.Valid
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                    }`
                },
                {
                    rowName: getPaymentStatus(invoice).message,
                    rowStyles: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        getPaymentStatus(invoice).styles
                    }`
                }
            );
        }

        if (
            Services.auth.setting?.eInvoicingEnvironmentType.value !== EInvoicingEnvironmentType.NotRegistered
            && fixedType === InvoiceType.Sell
        ) {
            cells.push({
                rowName: (
                    <div className="flex items-center gap-2">
                        {getEInvoiceStatus(invoice).message && (
                            <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    getEInvoiceStatus(invoice).styles
                                }`}
                            >
                {getEInvoiceStatus(invoice).message}
              </span>
                        )}
                        {invoice.eInvoiceStatus.value === EInvoiceStatus.NotSent
                            && invoice.statusId.value === InvoiceStatus.Valid
                            && (invoice.type.value === InvoiceType.Sell || invoice.type.value === InvoiceType.SellReturn) && (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6 text-red-500 hover:text-red-600 hover:bg-red-50"
                                            onClick={() => resendingEInvoice.value = true}
                                            disabled={resendingEInvoice.value}
                                        >
                                            <RotateCw className="h-3.5 w-3.5"/>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="top">
                                        <p>{t("invoices.resendTooltip")}</p>
                                    </TooltipContent>
                                </Tooltip>
                            )}
                    </div>
                ),
                rowStyles: ""
            });
        }

        if (
            Services.auth.hasAuth(
                SystemPermissionsResources.ReportAccountStatement,
                SystemPermissionsActions.Get
            ) && invoice.statusId.value === InvoiceStatus.Valid
        ) {
            cells.push({
                rowName: (
                    <ReportButton
                        reportName={ReportConstants.Invoice}
                        request={{invoiceId: invoice.id}}
                        fileName={`${invoice.id}-${getInvoiceTypeName(invoice.type.value, t)}-${invoice.actionAccountName}`}
                    />
                ),
                rowStyles: "w-32"
            });
        }

        return cells;
    };

    if (Cubits.pricingMethods.state.value instanceof PageLoaded) {
        return (
            <CrudPage.Table>
                <CrudPage.TableBody<Invoice, InvoiceDto>
                    data={Cubits.invoices.entities.value}
                    headerRows={getTableHeadRows()}
                    tableRowMapper={(invoice: Invoice) => getTableRowMapper(invoice)}
                    hasUpdatePermission={Services.auth.hasAuth(
                        permissionResource,
                        SystemPermissionsActions.Update
                    )}
                    hasDeletePermission={Services.auth.hasAuth(
                        permissionResource,
                        SystemPermissionsActions.Delete
                    )}
                />
                <CrudPage.TablePagination
                    pageSize={Cubits.invoices.pageSize.value}
                    totalNumber={Cubits.invoices.count.value}
                    currentPage={Cubits.invoices.currentPage.value}
                    onPageChanged={(newPage) => {
                        Cubits.invoices.changePage(newPage);
                    }}
                />
            </CrudPage.Table>
        );
    }

    if (Cubits.pricingMethods.state.value instanceof PageError) {
        return <TablePreview.Error/>;
    }

    return <TablePreview.Empty/>;
}

function InvoicesReportButton({fixedType}: { fixedType?: InvoiceType }) {
    useSignals();
    return (
        <ReportButton<InvoicesListReportRequest>
            reportName={ReportConstants.InvoicesList}
            request={{
                // Sell page covers Sell + SellReturn + Quotation;
                // Purchase page covers Purchase + PurchaseReturn.
                types:
                    fixedType === InvoiceType.Sell
                        ? [InvoiceType.Sell, InvoiceType.SellReturn, InvoiceType.Quotation]
                        : [InvoiceType.Purchase, InvoiceType.PurchaseReturn],
                // Read the live search text from the cubit so the report is scoped
                searchText: Cubits.invoices.searchText.value,
                reportType: InvoicesListReportType.InvoicesList,
            }}
        />
    );
}

const getInvoiceTypeName = (type: InvoiceType, t: TFunction<"accounting">) => {
    switch (type) {
        case InvoiceType.Sell:
            return t("invoices.sellInvoice");
        case InvoiceType.Purchase:
            return t("invoices.purchaseInvoice");
        case InvoiceType.SellReturn:
            return t("invoices.sellReturn");
        case InvoiceType.Quotation:
            return t("invoices.quotation");
        case InvoiceType.PurchaseReturn:
            return t("invoices.purchaseReturn");
        default:
            return t("invoices.unknown");
    }
};