import { Cubits } from "@/core/services/cubits";
import { Services } from "@/core/services/services";
import { useSignals } from "@preact/signals-react/runtime";
import { CreditCardIcon } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { CrudPage, CrudPageOld, PageError, PageLoaded, PageLoading, selectPermissionsByResource, SystemPermissions, SystemPermissionsActions, TablePreview, UnauthorizedPage } from "yusr-ui";
import { SystemPermissionsResources } from "../../core/auth/systemPermissionsResources";
import type PaymentMethodOld from "../../core/data/paymentMethod";
import { CommissionTypeOld, PaymentMethodSlice } from "../../core/data/paymentMethod";
import PaymentMethodsApiServiceOld from "../../core/networking/paymentMethodApiServiceOld";
import { useAppDispatch, useAppSelector } from "../../core/state/store";
import ChangePaymentMethodDialogOld from "./changePaymentMethodDialog";
import type { PaymentMethod, PaymentMethodDto } from "./data/paymentMethod";

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

export function PaymentMethodsPage()
{
  useSignals();
  if (!Services.auth.hasAuth(SystemPermissionsResources.PaymentMethods, SystemPermissionsActions.Get))
  {
    return <UnauthorizedPage />;
  }

  const { t } = useTranslation("accounting");

  useEffect(() => Cubits.paymentMethods.init(), []);

  return (
    <CrudPage>
      <CrudPage.Header
        title={ t("paymentMethods.title") }
        addButtonTitle={ t("paymentMethods.addNewTitle") }
        isAddButtonVisible={ Services.auth.hasAuth(
          SystemPermissionsResources.PaymentMethods,
          SystemPermissionsActions.Add
        ) }
      />

      <Cards />

      <PageTable />

      <CrudPage.DeleteDialog
        entityNameSelector={ (PaymentMethod) => PaymentMethod.name }
        service={ Services.paymentMethodsApi }
        onSuccess={ (entity) => Cubits.paymentMethods.delete(entity) }
      />
    </CrudPage>
  );
}

function Cards()
{
  useSignals();
  const { t } = useTranslation("accounting");

  return (
    <CrudPage.Cards
      cards={ [{
        title: t("paymentMethods.totalMethods"),
        data: Cubits.paymentMethods.count.value.toString(),
        icon: <CreditCardIcon className="h-4 w-4 text-muted-foreground" />
      }] }
    />
  );
}

function PageTable()
{
  useSignals();
  const { t } = useTranslation("accounting");
  if (Cubits.paymentMethods.state.value instanceof PageLoading)
  {
    return <TablePreview.Loading />;
  }

  if (Cubits.paymentMethods.state.value instanceof PageLoaded)
  {
    return (
      <CrudPage.Table>
        <CrudPage.TableBody<PaymentMethod, PaymentMethodDto>
          data={ Cubits.paymentMethods.entities.value }
          headerRows={ [
            { rowBody: "", rowStyles: "text-left w-12.5" },
            { rowBody: t("paymentMethods.methodId"), rowStyles: "w-20" },
            { rowBody: t("paymentMethods.name"), rowStyles: "w-40" },
            { rowBody: t("paymentMethods.account"), rowStyles: "w-40" },
            { rowBody: t("paymentMethods.commissionType"), rowStyles: "w-30" },
            { rowBody: t("paymentMethods.commissionValue"), rowStyles: "w-30" }
          ] }
          tableRowMapper={ (
            paymentMethod
          ) => [{ rowBody: `#${paymentMethod.id.value}`, rowStyles: "" }, {
            rowBody: paymentMethod.name.value,
            rowStyles: "font-semibold"
          }, {
            rowBody: paymentMethod.accountName.value || paymentMethod.accountId.value.toString(),
            rowStyles: ""
          }, {
            rowBody: paymentMethod.commissionType.value === CommissionTypeOld.Percent
              ? t("paymentMethods.percentage")
              : t("paymentMethods.fixedAmount"),
            rowStyles: "text-sm text-muted-foreground"
          }, {
            rowBody: paymentMethod.commissionAmount.value.toString(),
            rowStyles: "font-medium text-blue-600"
          }] }
          hasUpdatePermission={ Services.auth.hasAuth(
            SystemPermissionsResources.PaymentMethods,
            SystemPermissionsActions.Update
          ) }
          hasDeletePermission={ Services.auth.hasAuth(
            SystemPermissionsResources.PaymentMethods,
            SystemPermissionsActions.Delete
          ) }
        />

        <CrudPage.TablePagination
          pageSize={ Cubits.paymentMethods.pageSize.value }
          totalNumber={ Cubits.paymentMethods.count.value }
          currentPage={ Cubits.paymentMethods.currentPage.value }
          onPageChanged={ (newPage) =>
          {
            Cubits.paymentMethods.changePage(newPage);
          } }
        />
      </CrudPage.Table>
    );
  }

  if (Cubits.paymentMethods.state.value instanceof PageError)
  {
    return <TablePreview.Error />;
  }

  return <TablePreview.Empty />;
}
