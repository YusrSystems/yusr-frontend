import { CreditCardIcon } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { CrudPageOld, selectPermissionsByResource, SystemPermissions, SystemPermissionsActions } from "yusr-ui";
import { SystemPermissionsResources } from "../../core/auth/systemPermissionsResources";
import type PaymentMethodOld from "../../core/data/paymentMethod";
import { CommissionTypeOld, PaymentMethodSlice } from "../../core/data/paymentMethod";
import PaymentMethodsApiServiceOld from "../../core/networking/paymentMethodApiServiceOld";
import { useAppDispatch, useAppSelector } from "../../core/state/store";
import ChangePaymentMethodDialogOld from "./changePaymentMethodDialog";

export default function PaymentMethodsPageOld()
{
  const { t } = useTranslation("accounting");
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state) => state.auth);
  const paymentMethodState = useAppSelector((state) => state.paymentMethod);
  const paymentMethodDialogState = useAppSelector(
    (state) => state.paymentMethodDialog
  );

  const permissions = useAppSelector((state) =>
    selectPermissionsByResource(
      state,
      SystemPermissionsResources.PaymentMethods
    )
  );

  const service = useMemo(() => new PaymentMethodsApiServiceOld(), []);

  return (
    <CrudPageOld<PaymentMethodOld>
      title={ t("paymentMethods.title") }
      entityName={ t("paymentMethods.entityName") }
      addNewItemTitle={ t("paymentMethods.addNewTitle") }
      permissions={ permissions }
      hasPagePermission={ SystemPermissions.hasAuth(
        authState.loggedInUser?.role?.permissions ?? [],
        SystemPermissionsResources.PaymentMethods,
        SystemPermissionsActions.Get
      ) }
      entityState={ paymentMethodState }
      useSlice={ () => paymentMethodDialogState }
      service={ service }
      cards={ [{
        title: t("paymentMethods.totalMethods"),
        data: (paymentMethodState.entities?.count ?? 0).toString(),
        icon: <CreditCardIcon className="h-4 w-4 text-muted-foreground" />
      }] }
      tableHeadRows={ [
        { rowName: "", rowStyles: "text-left w-12.5" },
        { rowName: t("paymentMethods.methodId"), rowStyles: "w-20" },
        { rowName: t("paymentMethods.name"), rowStyles: "w-40" },
        { rowName: t("paymentMethods.account"), rowStyles: "w-40" },
        { rowName: t("paymentMethods.commissionType"), rowStyles: "w-30" },
        { rowName: t("paymentMethods.commissionValue"), rowStyles: "w-30" }
      ] }
      tableRowMapper={ (
        paymentMethod: PaymentMethodOld
      ) => [{ rowName: `#${paymentMethod.id}`, rowStyles: "" }, {
        rowName: paymentMethod.name,
        rowStyles: "font-semibold"
      }, {
        rowName: paymentMethod.accountName || paymentMethod.accountId.toString(),
        rowStyles: ""
      }, {
        rowName: paymentMethod.commissionType === CommissionTypeOld.Percent
          ? t("paymentMethods.percentage")
          : t("paymentMethods.fixedAmount"),
        rowStyles: "text-sm text-muted-foreground"
      }, {
        rowName: paymentMethod.commissionAmount.toString(),
        rowStyles: "font-medium text-blue-600"
      }] }
      actions={ {
        filter: PaymentMethodSlice.entityActions.filter,
        openChangeDialog: (entity) => PaymentMethodSlice.dialogActions.openChangeDialog(entity),
        openDeleteDialog: (entity) => PaymentMethodSlice.dialogActions.openDeleteDialog(entity),
        setIsChangeDialogOpen: (open) => PaymentMethodSlice.dialogActions.setIsChangeDialogOpen(open),
        setIsDeleteDialogOpen: (open) => PaymentMethodSlice.dialogActions.setIsDeleteDialogOpen(open),
        refresh: PaymentMethodSlice.entityActions.refresh,
        setCurrentPage: (page) => PaymentMethodSlice.entityActions.setCurrentPage(page)
      } }
      ChangeDialog={ 
        <ChangePaymentMethodDialogOld
          entity={ paymentMethodDialogState.selectedRow || undefined }
          mode={ paymentMethodDialogState.selectedRow ? "update" : "create" }
          service={ service }
          onSuccess={ (data, mode) =>
          {
            dispatch(PaymentMethodSlice.entityActions.refresh({ data: data }));
            if (mode === "create")
            {
              dispatch(
                PaymentMethodSlice.dialogActions.setIsChangeDialogOpen(false)
              );
            }
          } }
        />
       }
    />
  );
}
