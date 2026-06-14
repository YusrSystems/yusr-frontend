import {Services} from "@/core/services/services.ts";
import {SystemPermissionsResources} from "@/core/auth/systemPermissionsResources.ts";
import {
    CrudPage,
    CurrencyIcon,
    NumbertoWordsService,
    PageError,
    PageLoaded,
    PageLoading,
    SystemPermissionsActions,
    TablePreview,
    UnauthorizedPage
} from "yusr-ui";
import {useTranslation} from "react-i18next";
import {useEffect} from "react";
import {Cubits} from "@/core/services/cubits.ts";
import {useSignals} from "@preact/signals-react/runtime";
import {BoxIcon} from "lucide-react";
import {Voucher, type VoucherDto} from "@/core/data/voucher.ts";
import {VoucherType} from "@/core/data/voucherOld.ts";
import ReportButton from "@/features/reports/reportButton.tsx";
import ReportConstants from "@/core/data/report/reportConstants.ts";
import ChangeVoucherDialog from "@/features/vouchers/changeVoucherDialog.tsx";

export default function VouchersPage() {
    useSignals();
    const {t} = useTranslation("accounting");
    useEffect(() => Cubits.vouchers.init(), []);
    if (!Services.auth.hasAuth(SystemPermissionsResources.Vouchers, SystemPermissionsActions.Get)) {
        return <UnauthorizedPage/>;
    }


    return <CrudPage>
        <CrudPage.Header
            title={t("vouchers.title")}
            addButtonTitle={t("vouchers.addNewTitle")}
            isAddButtonVisible={Services.auth.hasAuth(SystemPermissionsResources.Vouchers, SystemPermissionsActions.Add)}
        />

        <Cards/>

        <PageTable/>


        <CrudPage.ChangeDialog
            changeDialog={(dto: VoucherDto | undefined, closeDialog) => {
                return (
                    <ChangeVoucherDialog
                        entity={dto
                            ? Voucher.load(dto)
                            : Voucher.create()}
                        service={Services.voucherApi}
                        onSuccess={(data) => {
                            if (data.mode.value === "create") {
                                Cubits.vouchers.add(data);
                                closeDialog();
                            } else if (data.mode.value === "update") {
                                Cubits.vouchers.update(data);
                            }
                        }}
                    />
                );
            }}
        />


        <CrudPage.DeleteDialog
            entityNameSelector={(voucher) => voucher.id}
            service={Services.voucherApi}
            onSuccess={(entity) => Cubits.vouchers.delete(entity)}
        />


    </CrudPage>

}


function Cards() {
    useSignals();
    const {t} = useTranslation("accounting");
    return (
        <CrudPage.Cards
            cards={[{
                title: t("vouchers.totalVouchers"),
                data: (Cubits.vouchers.count.value ?? 0).toString(),
                icon: <BoxIcon className="h-4 w-4 text-muted-foreground"/>
            }]}
        />
    );
}

function PageTable() {
    useSignals();
    const {t} = useTranslation(["accounting", "common"]);

    if (Cubits.vouchers.state.value instanceof PageLoading) {
        return <TablePreview.Loading/>;
    }

    if (Cubits.vouchers.state.value instanceof PageLoaded) {
        return (
            <CrudPage.Table>
                <CrudPage.TableBody<Voucher, VoucherDto>
                    data={Cubits.vouchers.entities.value}

                    headerRows={[
                        {rowBody: "", rowStyles: "text-left w-12.5"},
                        {rowBody: t("vouchers.voucherId"), rowStyles: "w-24"},
                        {rowBody: t("vouchers.voucherId"), rowStyles: "w-24"},
                        {rowBody: t("vouchers.voucherType"), rowStyles: "w-24"},
                        {rowBody: t("vouchers.date"), rowStyles: "w-24"},
                        {rowBody: t("vouchers.account"), rowStyles: "w-40"},
                        {rowBody: t("vouchers.amount"), rowStyles: "w-32"},
                        {rowBody: t("vouchers.paymentMethod"), rowStyles: "w-32"},
                        ...(Services.auth.hasAuth(
                            SystemPermissionsResources.ReportVoucher,
                            SystemPermissionsActions.Get
                        )
                            ? [{rowBody: "", rowStyles: "w-32"}]
                            : [])
                    ]}


                    tableRowMapper={(
                        voucher: Voucher
                    ) => [
                        {rowBody: `#${voucher.id.value}`, rowStyles: ""},
                        {rowBody: `#${voucher.invoiceId}`, rowStyles: ""},
                        {
                            rowBody: voucher.type.value === VoucherType.Payment ? t("vouchers.paymentVoucher") : t("vouchers.receiptVoucher"),
                            rowStyles: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                voucher.type.value === VoucherType.Payment ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                            }`
                        },
                        {rowBody: new Date(voucher.date.value).toLocaleDateString("en-CA"), rowStyles: ""},
                        {rowBody: voucher.accountName ?? "-", rowStyles: "font-semibold"},
                        {
                            rowBody: (
                                <div className="flex items-center gap-1">
                                    {(voucher.amount.value ?? 0).toLocaleString("en-US")}
                                    <CurrencyIcon/>
                                </div>
                            ),
                            rowStyles: "font-mono font-bold"
                        },
                        {rowBody: voucher.paymentMethod?.name ?? "-", rowStyles: "text-sm text-gray-600"},
                        ...(Services.auth.hasAuth(
                            SystemPermissionsResources.ReportVoucher,
                            SystemPermissionsActions.Get
                        )
                            ? [{
                                rowBody: (
                                    <ReportButton
                                        reportName={ReportConstants.Voucher}
                                        request={{
                                            voucherId: voucher.id,
                                            tafqit: Services?.auth?.setting?.currency
                                                ? NumbertoWordsService.ConvertAmount(voucher.amount.value, Services?.auth?.setting?.currency.value)
                                                : NumbertoWordsService.Convert(voucher.amount.value)
                                        }}
                                    />
                                ),
                                rowStyles: "w-32"
                            }]
                            : [])
                    ]}


                    hasUpdatePermission={Services.auth.hasAuth(
                        SystemPermissionsResources.Vouchers,
                        SystemPermissionsActions.Update
                    )}
                    hasDeletePermission={Services.auth.hasAuth(
                        SystemPermissionsResources.Vouchers,
                        SystemPermissionsActions.Delete
                    )}
                />
                <CrudPage.TablePagination
                    pageSize={Cubits.vouchers.pageSize.value}
                    totalNumber={Cubits.vouchers.count.value}
                    currentPage={Cubits.vouchers.currentPage.value}
                    onPageChanged={(newPage) => {
                        Cubits.vouchers.changePage(newPage);
                    }}
                />
            </CrudPage.Table>
        );
    }

    if (Cubits.vouchers.state.value instanceof PageError) {
        return <TablePreview.Error/>;
    }

    return <TablePreview.Empty/>;
}







