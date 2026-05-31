import { TagIcon } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { CrudPageOld, selectPermissionsByResource, SystemPermissions, SystemPermissionsActions } from "yusr-ui";
import { SystemPermissionsResources } from "../../core/auth/systemPermissionsResources";
import type PricingMethod from "../../core/data/pricingMethod";
import { PricingMethodSlice } from "../../core/data/pricingMethod";
import PricingMethodsApiService from "../../core/networking/PricingMethodsApiService";
import { useAppDispatch, useAppSelector } from "../../core/state/store";
import ChangePricingMethodDialog from "./changePricingMethodDialog";

export default function PricingMethodsPage() {
  const { t } = useTranslation("stocking");
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state) => state.auth);
  const pricingMethodState = useAppSelector((state) => state.pricingMethod);
  const pricingMethodDialogState = useAppSelector(
    (state) => state.pricingMethodDialog
  );

  const permissions = useAppSelector((state) =>
    selectPermissionsByResource(
      state,
      SystemPermissionsResources.PricingMethods
    )
  );

  const service = useMemo(() => new PricingMethodsApiService(), []);

  return (
    <CrudPageOld<PricingMethod>
      title={t("pricingMethods.title")}
      entityName={t("pricingMethods.entityName")}
      addNewItemTitle={t("pricingMethods.addNewTitle")}
      permissions={permissions}
      hasPagePermission={SystemPermissions.hasAuth(
        authState.loggedInUser?.role?.permissions ?? [],
        SystemPermissionsResources.PricingMethods,
        SystemPermissionsActions.Get
      )}
      entityState={pricingMethodState}
      useSlice={() => pricingMethodDialogState}
      service={service}
      cards={[{
        title: t("pricingMethods.totalMethods"),
        data: (pricingMethodState.entities?.count ?? 0).toString(),
        icon: <TagIcon className="h-4 w-4 text-muted-foreground" />
      }]}
      tableHeadRows={[{ rowName: "", rowStyles: "text-left w-12.5" }, {
        rowName: t("pricingMethods.methodId"),
        rowStyles: "w-30"
      }, { rowName: t("pricingMethods.methodName"), rowStyles: "w-70" }]}
      tableRowMapper={(
        pricingMethod: PricingMethod
      ) => [{ rowName: `#${pricingMethod.id}`, rowStyles: "" }, {
        rowName: pricingMethod.name,
        rowStyles: "font-semibold"
      }]}
      actions={{
        filter: PricingMethodSlice.entityActions.filter,
        openChangeDialog: (entity) => PricingMethodSlice.dialogActions.openChangeDialog(entity),
        openDeleteDialog: (entity) => PricingMethodSlice.dialogActions.openDeleteDialog(entity),
        setIsChangeDialogOpen: (open) => PricingMethodSlice.dialogActions.setIsChangeDialogOpen(open),
        setIsDeleteDialogOpen: (open) => PricingMethodSlice.dialogActions.setIsDeleteDialogOpen(open),
        refresh: PricingMethodSlice.entityActions.refresh,
        setCurrentPage: (page) => PricingMethodSlice.entityActions.setCurrentPage(page)
      }}
      ChangeDialog={
        <ChangePricingMethodDialog
          entity={pricingMethodDialogState.selectedRow || undefined}
          mode={pricingMethodDialogState.selectedRow ? "update" : "create"}
          service={service}
          onSuccess={(data, mode) => {
            dispatch(PricingMethodSlice.entityActions.refresh({ data: data }));
            if (mode === "create") {
              dispatch(
                PricingMethodSlice.dialogActions.setIsChangeDialogOpen(false)
              );
            }
          }}
        />
      }
    />
  );
}
