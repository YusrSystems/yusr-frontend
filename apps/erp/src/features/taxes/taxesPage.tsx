import { Percent } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { CrudPage, selectPermissionsByResource, SystemPermissions, SystemPermissionsActions } from "yusr-ui";
import { SystemPermissionsResources } from "../../core/auth/systemPermissionsResources";
import { TaxOld, TaxSlice } from "../../core/data/tax";
import TaxesApiService from "../../core/networking/taxesApiService";
import { useAppDispatch, useAppSelector } from "../../core/state/store";
import ChangeTaxDialog from "./changeTaxDialog";

export default function TaxesPage() {
  const { t } = useTranslation("accounting");
  const { t: tCommon } = useTranslation("common");
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state) => state.auth);
  const taxState = useAppSelector((state) => state.tax);
  const taxDialogState = useAppSelector((state) => state.taxDialog);
  const permissions = useAppSelector((state) => selectPermissionsByResource(state, SystemPermissionsResources.Taxes));
  const service = useMemo(() => new TaxesApiService(), []);

  return (
    <CrudPage<TaxOld>
      title={t("taxes.title")}
      entityName={t("taxes.entityName")}
      addNewItemTitle={t("taxes.addNewTitle")}
      permissions={permissions}
      hasPagePermission={SystemPermissions.hasAuth(
        authState.loggedInUser?.role?.permissions ?? [],
        SystemPermissionsResources.Taxes,
        SystemPermissionsActions.Get
      )}
      entityState={taxState}
      useSlice={() => taxDialogState}
      service={service}
      cards={[{
        title: t("taxes.totalTaxes"),
        data: (taxState.entities?.count ?? 0).toString(),
        icon: <Percent className="h-4 w-4 text-muted-foreground" />
      }]}
      tableHeadRows={[
        { rowName: "", rowStyles: "text-left w-12.5" },
        { rowName: t("taxes.taxNumber"), rowStyles: "w-30" },
        { rowName: t("taxes.taxName"), rowStyles: "w-50" },
        { rowName: t("taxes.percentage"), rowStyles: "w-30" },
        { rowName: t("taxes.isPrimary"), rowStyles: "" }
      ]}
      tableRowMapper={(
        tax: TaxOld
      ) => [{ rowName: `#${tax.id}`, rowStyles: "" }, { rowName: tax.name, rowStyles: "font-semibold" }, {
        rowName: `%${tax.percentage}`,
        rowStyles: ""
      }, {
        rowName: tax.isPrimary ? tCommon("yes") : tCommon("no"),
        rowStyles: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${tax.isPrimary ? "bg-blue-300" : "bg-gray-200"
          } text-slate-800`
      }]}
      actions={{
        filter: TaxSlice.entityActions.filter,
        openChangeDialog: (entity) => TaxSlice.dialogActions.openChangeDialog(entity),
        openDeleteDialog: (entity) => TaxSlice.dialogActions.openDeleteDialog(entity),
        setIsChangeDialogOpen: (open) => TaxSlice.dialogActions.setIsChangeDialogOpen(open),
        setIsDeleteDialogOpen: (open) => TaxSlice.dialogActions.setIsDeleteDialogOpen(open),
        refresh: TaxSlice.entityActions.refresh,
        setCurrentPage: (page) => TaxSlice.entityActions.setCurrentPage(page)
      }}
      ChangeDialog={
        <ChangeTaxDialog
          entity={taxDialogState.selectedRow || undefined}
          mode={taxDialogState.selectedRow ? "update" : "create"}
          service={service}
          onSuccess={(data, mode) => {
            dispatch(TaxSlice.entityActions.refresh({ data: data }));
            if (mode === "create") {
              dispatch(TaxSlice.dialogActions.setIsChangeDialogOpen(false));
            }
          }}
        />
      }
    />
  );
}
