import type { VouchersListReportRequest } from "@/core/data/report/vouchersListReportRequest";
import { FileText } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { CrudPageOld, CurrencyIcon, NumbertoWordsService, selectPermissionsByResource, SystemPermissions, SystemPermissionsActions } from "yusr-ui";
import { SystemPermissionsResources } from "../../core/auth/systemPermissionsResources";
import ReportConstants from "../../core/data/report/reportConstants";
import Voucher, { VoucherSlice, VoucherType } from "../../core/data/voucher";
import VouchersApiService from "../../core/networking/voucherApiService";
import { useAppDispatch, useAppSelector } from "../../core/state/store";
import ReportButton from "../reports/reportButton";
import ChangeVoucherDialog from "./changeVoucherDialog";

export default function VouchersPage()
{
  const { t } = useTranslation("accounting");
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state) => state.auth);
  const voucherState = useAppSelector((state) => state.voucher);
  const voucherDialogState = useAppSelector((state) => state.voucherDialog);

  const permissions = useAppSelector((state) =>
    selectPermissionsByResource(state, SystemPermissionsResources.Vouchers)
  );

  const service = useMemo(() => new VouchersApiService(), []);
  const [searchText, setSearchText] = useState<string | undefined>(undefined);

  return (
    <CrudPageOld<Voucher>
      title={ t("vouchers.title") }
      entityName={ t("vouchers.entityName") }
      addNewItemTitle={ t("vouchers.addNewTitle") }
      onSearchTextChange={ setSearchText }
      actionButtons={ SystemPermissions.hasAuth(
          authState.loggedInUser?.role?.permissions ?? [],
          SystemPermissionsResources.ReportVoucherList,
          SystemPermissionsActions.Get
        )
        ? [
          <ReportButton<VouchersListReportRequest>
            reportName={ ReportConstants.VouchersList }
            request={ {
              searchText: searchText
            } }
          />
        ]
        : [] }
      permissions={ permissions }
      hasPagePermission={ SystemPermissions.hasAuth(
        authState.loggedInUser?.role?.permissions ?? [],
        SystemPermissionsResources.Vouchers,
        SystemPermissionsActions.Get
      ) }
      entityState={ voucherState }
      useSlice={ () => voucherDialogState }
      service={ service }
      cards={ [{
        title: t("vouchers.totalVouchers"),
        data: (voucherState.entities?.count ?? 0).toString(),
        icon: <FileText className="h-4 w-4 text-muted-foreground" />
      }] }
      tableHeadRows={ [
        { rowName: "", rowStyles: "text-left w-12.5" },
        { rowName: t("vouchers.voucherId"), rowStyles: "w-24" },
        { rowName: t("vouchers.voucherId"), rowStyles: "w-24" },
        { rowName: t("vouchers.voucherType"), rowStyles: "w-24" },
        { rowName: t("vouchers.date"), rowStyles: "w-24" },
        { rowName: t("vouchers.account"), rowStyles: "w-40" },
        { rowName: t("vouchers.amount"), rowStyles: "w-32" },
        { rowName: t("vouchers.paymentMethod"), rowStyles: "w-32" },
        ...(SystemPermissions.hasAuth(
            authState.loggedInUser?.role?.permissions ?? [],
            SystemPermissionsResources.ReportVoucher,
            SystemPermissionsActions.Get
          )
          ? [{ rowName: "", rowStyles: "w-32" }]
          : [])
      ] }
      tableRowMapper={ (
        voucher: Voucher
      ) => [
        { rowName: `#${voucher.id}`, rowStyles: "" },
        { rowName: `#${voucher.invoiceId}`, rowStyles: "" },
        {
          rowName: voucher.type === VoucherType.Payment ? t("vouchers.paymentVoucher") : t("vouchers.receiptVoucher"),
          rowStyles: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            voucher.type === VoucherType.Payment ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
          }`
        },
        { rowName: new Date(voucher.date).toLocaleDateString("en-CA"), rowStyles: "" },
        { rowName: voucher.accountName ?? "-", rowStyles: "font-semibold" },
        {
          rowName: (
            <div className="flex items-center gap-1">
              { (voucher.amount ?? 0).toLocaleString("en-US") }
              <CurrencyIcon />
            </div>
          ),
          rowStyles: "font-mono font-bold"
        },
        { rowName: voucher.paymentMethod?.name ?? "-", rowStyles: "text-sm text-gray-600" },
        ...(SystemPermissions.hasAuth(
            authState.loggedInUser?.role?.permissions ?? [],
            SystemPermissionsResources.ReportVoucher,
            SystemPermissionsActions.Get
          )
          ? [{
            rowName: (
              <ReportButton
                reportName={ ReportConstants.Voucher }
                request={ {
                  voucherId: voucher.id,
                  tafqit: authState.setting?.currency
                    ? NumbertoWordsService.ConvertAmountOld(voucher.amount, authState.setting.currency)
                    : NumbertoWordsService.Convert(voucher.amount)
                } }
              />
            ),
            rowStyles: "w-32"
          }]
          : [])
      ] }
      actions={ {
        filter: VoucherSlice.entityActions.filter,
        openChangeDialog: (entity) => VoucherSlice.dialogActions.openChangeDialog(entity),
        openDeleteDialog: (entity) => VoucherSlice.dialogActions.openDeleteDialog(entity),
        setIsChangeDialogOpen: (open) => VoucherSlice.dialogActions.setIsChangeDialogOpen(open),
        setIsDeleteDialogOpen: (open) => VoucherSlice.dialogActions.setIsDeleteDialogOpen(open),
        refresh: VoucherSlice.entityActions.refresh,
        setCurrentPage: (page) => VoucherSlice.entityActions.setCurrentPage(page)
      } }
      ChangeDialog={ 
        <ChangeVoucherDialog
          entity={ voucherDialogState.selectedRow || undefined }
          mode={ voucherDialogState.selectedRow ? "update" : "create" }
          service={ service }
          onSuccess={ (data, mode) =>
          {
            dispatch(VoucherSlice.entityActions.refresh({ data: data }));
            if (mode === "create")
            {
              dispatch(VoucherSlice.dialogActions.setIsChangeDialogOpen(false));
            }
          } }
        />
       }
    />
  );
}
