import { ArrowLeftRightIcon } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { CrudPageOld, selectPermissionsByResource, SystemPermissions, SystemPermissionsActions } from "yusr-ui";
import { SystemPermissionsResources } from "../../core/auth/systemPermissionsResources";
import type ItemTransfer from "../../core/data/itemTransfer";
import { ItemTransferSlice } from "../../core/data/itemTransfer";
import ReportConstants from "../../core/data/report/reportConstants";
import ItemTransferApiService from "../../core/networking/itemTransferApiService";
import { useAppDispatch, useAppSelector } from "../../core/state/store";
import ReportButton from "../reports/reportButton";
import ChangeItemTransferDialog from "./changeItemTransferDialog";

export default function ItemTransfersPage() {
  const { t } = useTranslation("stocking");
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state) => state.auth);
  const itemTransferState = useAppSelector((state) => state.itemTransfer);
  const itemTransferDialogState = useAppSelector((state) => state.itemTransferDialog);

  const permissions = useAppSelector((state) =>
    selectPermissionsByResource(state, SystemPermissionsResources.ItemTransfers || "")
  );

  const service = useMemo(() => new ItemTransferApiService(), []);

  return (
    <CrudPageOld<ItemTransfer>
      title={t("itemTransfers.title")}
      entityName={t("itemTransfers.entityName")}
      addNewItemTitle={t("itemTransfers.addNewTitle")}
      permissions={permissions}
      hasPagePermission={SystemPermissions.hasAuth(
        authState.loggedInUser?.role?.permissions ?? [],
        SystemPermissionsResources.ItemTransfers,
        SystemPermissionsActions.Get
      )}
      entityState={itemTransferState}
      useSlice={() => itemTransferDialogState}
      service={service}
      cards={[{
        title: t("itemTransfers.totalTransfers"),
        data: (itemTransferState.entities?.count ?? 0).toString(),
        icon: <ArrowLeftRightIcon className="h-4 w-4 text-muted-foreground" />
      }]}
      tableHeadRows={[
        { rowName: "", rowStyles: "w-12" },
        { rowName: t("itemTransfers.transferId"), rowStyles: "w-24" },
        { rowName: t("itemTransfers.date"), rowStyles: "w-32" },
        { rowName: t("itemTransfers.fromStore"), rowStyles: "w-48" },
        { rowName: t("itemTransfers.toStore"), rowStyles: "w-48" },
        { rowName: t("itemTransfers.description"), rowStyles: "" },
        ...(SystemPermissions.hasAuth(
          authState.loggedInUser?.role?.permissions ?? [],
          SystemPermissionsResources.ReportItemTransfer,
          SystemPermissionsActions.Get
        )
          ? [{ rowName: "", rowStyles: "w-32" }]
          : [])
      ]}
      tableRowMapper={(
        transfer: ItemTransfer
      ) => [
          { rowName: `#${transfer.id}` },
          { rowName: new Date(transfer.transferDate).toLocaleDateString("en-CA"), rowStyles: "" },
          { rowName: transfer.fromStoreName, rowStyles: "font-semibold" },
          { rowName: transfer.toStoreName, rowStyles: "font-semibold" },
          { rowName: transfer.description || "-", rowStyles: "text-muted-foreground" },
          ...(SystemPermissions.hasAuth(
            authState.loggedInUser?.role?.permissions ?? [],
            SystemPermissionsResources.ReportItemTransfer,
            SystemPermissionsActions.Get
          )
            ? [{
              rowName: (
                <ReportButton
                  reportName={ReportConstants.ItemTransfer}
                  request={{ itemTransferId: transfer.id }}
                />
              ),
              rowStyles: "w-32"
            }]
            : [])
        ]}
      actions={{
        filter: ItemTransferSlice.entityActions.filter,
        openChangeDialog: (entity) => dispatch(ItemTransferSlice.dialogActions.openChangeDialog(entity)),
        openDeleteDialog: (entity) => dispatch(ItemTransferSlice.dialogActions.openDeleteDialog(entity)),
        setIsChangeDialogOpen: (open) => dispatch(ItemTransferSlice.dialogActions.setIsChangeDialogOpen(open)),
        setIsDeleteDialogOpen: (open) => dispatch(ItemTransferSlice.dialogActions.setIsDeleteDialogOpen(open)),
        refresh: ItemTransferSlice.entityActions.refresh,
        setCurrentPage: (page) => dispatch(ItemTransferSlice.entityActions.setCurrentPage(page))
      }}
      ChangeDialog={
        <ChangeItemTransferDialog
          entity={itemTransferDialogState.selectedRow || undefined}
          mode={itemTransferDialogState.selectedRow ? "update" : "create"}
          service={service}
          onSuccess={(data, mode) => {
            dispatch(ItemTransferSlice.entityActions.refresh({ data }));
            if (mode === "create") {
              dispatch(ItemTransferSlice.dialogActions.setIsChangeDialogOpen(false));
            }
          }}
        />
      }
    />
  );
}
