import { FileTextIcon, RotateCw } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button, ContextMenuItem, CrudPage, DropdownMenuItem, FilterCondition, type IDialogState, type IEntityState, SystemPermissions, Tooltip, TooltipContent, TooltipTrigger } from "yusr-ui";
import { SystemPermissionsActions } from "../../../../../packages/yusr-ui/src/auth/systemPermissionsActions";
import CurrencyIcon from "../../../../../packages/yusr-ui/src/components/custom/currency/currencyIcon";
import { selectPermissionsByResource } from "../../core/auth/authSelectors";
import { SystemPermissionsResources } from "../../core/auth/systemPermissionsResources";
import type Account from "../../core/data/account";
import type { AccountSliceType } from "../../core/data/account";
import Invoice, { EInvoiceStatus, InvoiceFilterColumns, InvoiceSlice, InvoiceStatus, InvoiceType } from "../../core/data/invoice";
import { InvoicesListReportType } from "../../core/data/report/invoicesListReportType";
import ReportConstants from "../../core/data/report/reportConstants";
import { EInvoicingEnvironmentType } from "../../core/data/setting";
import InvoicesApiService from "../../core/networking/invoiceApiService";
import { type RootState, useAppDispatch, useAppSelector } from "../../core/state/store";
import ReportButton from "../reports/reportButton";
import ChangeInvoiceDialog from "./changeInvoiceDialog";

export default function InvoicesPage({
  title,
  slice,
  stateKey,
  dialogStateKey,
  fixedType: fixedType,
  selectFormState,
  accountSlice,
  accountState,
  hasPagePermission,
  basePath
}: {
  title: string;
  slice: ReturnType<typeof InvoiceSlice.create>;
  stateKey: keyof RootState;
  dialogStateKey: keyof RootState;
  fixedType?: InvoiceType;
  selectFormState: (state: any) => { formData: Partial<Invoice>; errors: Record<string, string>; };
  accountSlice: AccountSliceType;
  accountState: IEntityState<Account>;
  hasPagePermission: boolean;
  basePath?: string;
})
{
  const dispatch = useAppDispatch();
  const [condition, setCondition] = useState<FilterCondition<Invoice> | undefined>(undefined);
  const [isAddReturn, setIsAddReturn] = useState<boolean>(false);
  const invoiceState = useAppSelector((state) => state[stateKey] as IEntityState<Invoice>);
  const authState = useAppSelector((state) => state.auth);
  const invoiceDialogState = useAppSelector((state) => state[dialogStateKey] as IDialogState<Invoice>);
  const [resendingEInvoice, setResendingEInvoice] = useState(false);

  // Update with your actual permission resource enum
  const permissions = useAppSelector((state) =>
    selectPermissionsByResource(state, SystemPermissionsResources.Invoices)
  );

  const getPaymentStatus = (invoice: Invoice): { message: string; styles: string; } =>
  {
    if (invoice.paidAmount === 0)
    {
      return { message: "غير مدفوعة", styles: "bg-red-100 text-red-800" };
    }

    if (invoice.paidAmount === invoice.fullAmount)
    {
      return { message: "مدفوعة بالكامل", styles: "bg-green-100 text-green-800" };
    }

    if (invoice.paidAmount > invoice.fullAmount)
    {
      return { message: "مدفوعة أكثر من اللازم", styles: "bg-red-100 text-red-800" };
    }

    return {
      message: `مدفوعة جزئيا (${invoice.paidAmount} ${authState.setting?.currency?.code})`,
      styles: "bg-orange-100 text-orange-800"
    };
  };

  const getEInvoiceStatus = (invoice: Invoice): { message: string; styles: string; } =>
  {
    if (
      authState.setting?.eInvoicingEnvironmentType === EInvoicingEnvironmentType.NotRegistered
      || invoice.statusId !== InvoiceStatus.Valid
      || (invoice.type !== InvoiceType.Sell && invoice.type !== InvoiceType.SellReturn)
    )
    {
      return { message: "", styles: "" };
    }

    if (invoice.eInvoiceStatus === EInvoiceStatus.NotSent)
    {
      return { message: "لم ترسل", styles: "bg-red-100 text-red-800" };
    }

    if (invoice.eInvoiceStatus === EInvoiceStatus.SentWithWarnings)
    {
      return { message: "أرسلت مع تحذيرات", styles: "bg-orange-100 text-orange-800" };
    }

    if (invoice.eInvoiceStatus === EInvoiceStatus.SentCorrectly)
    {
      return { message: "أرسلت", styles: "bg-green-100 text-green-800" };
    }

    return { message: "", styles: "" };
  };

  const service = useMemo(() => new InvoicesApiService(), []);

  const getActions = (
    entity: Invoice,
    ItemComponent: React.ComponentType<React.ComponentProps<any>>
  ) =>
  {
    const items: React.ReactNode[] = [];

    if (
      entity.type === InvoiceType.Quotation
      && SystemPermissions.hasAuth(
        authState.loggedInUser?.role?.permissions ?? [],
        SystemPermissionsResources.Invoices,
        SystemPermissionsActions.Delete
      )
    )
    {
      items.push(
        <ItemComponent
          className="text-red-600!"
          onSelect={ () =>
          {
            dispatch(slice.dialogActions.openDeleteDialog(entity));
          } }
        >
          حذف
        </ItemComponent>
      );
    }

    if (entity.type === InvoiceType.Sell || entity.type === InvoiceType.Purchase)
    {
      items.push(
        <ItemComponent
          onSelect={ () =>
          {
            setIsAddReturn(true);
            dispatch(slice.dialogActions.openChangeDialog(entity));
          } }
        >
          إرجاع
        </ItemComponent>
      );
    }

    return items;
  };

  const resendEInvoice = async (invoice: Invoice) =>
  {
    setResendingEInvoice(true);
    const res = await service.ResendEInvoice(invoice.id);
    if (res.status === 200 && res.data != undefined)
    {
      if (res.data === EInvoiceStatus.NotSent)
      {
        toast.error("لم يتم إرسال الفاتورة بنجاح");
      }
      else
      {
        toast.success("تم إرسال الفاتورة بنجاح");
      }
      dispatch(slice.entityActions.refresh({ data: { ...invoice, eInvoiceStatus: res.data } }));
    }
    setResendingEInvoice(false);
  };

  return (
    <CrudPage<Invoice>
      basePath={ basePath }
      routeIdParam="id"
      onRouteOpen={ async (id) =>
      {
        if (!hasPagePermission)
        {
          return;
        }

        const invoice = (await service.Get(id)).data;
        if (invoice == undefined)
        {
          return;
        }

        if (
          (fixedType === InvoiceType.Purchase
            && (invoice.type === InvoiceType.Sell || invoice.type === InvoiceType.SellReturn
              || invoice.type === InvoiceType.Quotation))
          || (fixedType === InvoiceType.Sell
            && (invoice.type === InvoiceType.Purchase || invoice.type === InvoiceType.PurchaseReturn))
        )
        {
          toast.error("الفاتورة غير موجودة");
          return;
        }

        dispatch(slice.dialogActions.openChangeDialog(invoice));
      } }
      title={ title }
      entityName="الفاتورة"
      addNewItemTitle="إنشاء فاتورة جديدة"
      onConditionChange={ setCondition }
      actionButtons={ SystemPermissions.hasAuth(
          authState.loggedInUser?.role?.permissions ?? [],
          SystemPermissionsResources.ReportInvoiceList,
          SystemPermissionsActions.Get
        )
        ? [
          <ReportButton
            reportName={ ReportConstants.InvoicesList }
            request={ {
              types: fixedType === InvoiceType.Sell
                ? [InvoiceType.Sell, InvoiceType.SellReturn, InvoiceType.Quotation]
                : [InvoiceType.Purchase, InvoiceType.PurchaseReturn],
              condition: condition,
              reportType: InvoicesListReportType.InvoicesList
            } }
          />
        ]
        : [] }
      permissions={ {
        getPermission: permissions.getPermission,
        addPermission: permissions.addPermission,
        updatePermission: permissions.updatePermission,
        deletePermission: false
      } }
      hasPagePermission={ hasPagePermission }
      entityState={ invoiceState }
      useSlice={ () => invoiceDialogState }
      service={ service }
      cards={ [{
        title: "إجمالي الفواتير",
        data: (invoiceState.entities?.count ?? 0).toString(),
        icon: <FileTextIcon className="h-4 w-4 text-muted-foreground" />
      }] }
      columnsToFilter={ InvoiceFilterColumns.columnsNames }
      tableHeadRows={ [
        { rowName: "", rowStyles: "text-left w-12.5" },
        { rowName: "رقم الفاتورة", rowStyles: "w-24" },
        { rowName: "النوع", rowStyles: "w-32" },
        { rowName: "التاريخ", rowStyles: "w-32" },
        { rowName: "الحساب", rowStyles: "w-48" },
        { rowName: "المستودع", rowStyles: "w-32" },
        { rowName: "الإجمالي", rowStyles: "w-32" },
        { rowName: "الحالة", rowStyles: "w-32" },
        { rowName: "", rowStyles: "w-32" },
        ...(authState.setting?.eInvoicingEnvironmentType !== EInvoicingEnvironmentType.NotRegistered
          ? [{ rowName: "حالة الفاتورة الإلكترونية", rowStyles: "w-50" }]
          : []),
        ...(SystemPermissions.hasAuth(
            authState.loggedInUser?.role?.permissions ?? [],
            SystemPermissionsResources.ReportInvoice,
            SystemPermissionsActions.Get
          )
          ? [{ rowName: "", rowStyles: "w-32" }]
          : [])
      ] }
      tableRowMapper={ (invoice: Invoice) => [
        { rowName: `#${invoice.id}`, rowStyles: "" },
        {
          rowName: getInvoiceTypeName(invoice.type),
          rowStyles: "font-semibold"
        },
        {
          rowName: new Date(invoice.date).toLocaleDateString("ar-SA"),
          rowStyles: ""
        },
        { rowName: invoice.actionAccountName || "-", rowStyles: "" },
        { rowName: invoice.storeName || "-", rowStyles: "" },
        {
          rowName: (
            <div className="flex items-center gap-1">
              { (invoice.fullAmount ?? 0).toLocaleString("en-US") }
              <CurrencyIcon />
            </div>
          ),
          rowStyles: "font-bold text-blue-600"
        },
        {
          rowName: invoice.statusId === InvoiceStatus.Valid ? "صالحة" : "محذوفة",
          rowStyles: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            invoice.statusId === InvoiceStatus.Valid
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`
        },
        {
          rowName: getPaymentStatus(invoice).message,
          rowStyles: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            getPaymentStatus(invoice).styles
          }`
        },
        ...(authState.setting?.eInvoicingEnvironmentType !== EInvoicingEnvironmentType.NotRegistered
          ? [{
            rowName: (
              <div className="flex items-center gap-2">
                { getEInvoiceStatus(invoice).message && (
                  <span
                    className={ `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      getEInvoiceStatus(invoice).styles
                    }` }
                  >
                    { getEInvoiceStatus(invoice).message }
                  </span>
                ) }

                { invoice.eInvoiceStatus === EInvoiceStatus.NotSent
                  && invoice.statusId === InvoiceStatus.Valid
                  && (invoice.type === InvoiceType.Sell || invoice.type === InvoiceType.SellReturn) && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={ () => resendEInvoice(invoice) }
                        disabled={ resendingEInvoice }
                      >
                        <RotateCw className="h-3.5 w-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p>إعادة إرسال الفاتورة الإلكترونية</p>
                    </TooltipContent>
                  </Tooltip>
                ) }
              </div>
            ),
            rowStyles: ``
          }]
          : []),
        ...(SystemPermissions.hasAuth(
            authState.loggedInUser?.role?.permissions ?? [],
            SystemPermissionsResources.ReportAccountStatement,
            SystemPermissionsActions.Get
          ) && invoice.statusId === InvoiceStatus.Valid
          ? [{
            rowName: <ReportButton reportName={ ReportConstants.Invoice } request={ { invoiceId: invoice.id } } />,
            rowStyles: "w-32"
          }]
          : [])
      ] }
      actions={ {
        filter: slice.entityActions.filter,
        openChangeDialog: (entity) =>
        {
          setIsAddReturn(false);
          return dispatch(slice.dialogActions.openChangeDialog(entity));
        },
        openDeleteDialog: (entity) => slice.dialogActions.openDeleteDialog(entity),
        setIsChangeDialogOpen: (open) =>
        {
          if (!open)
          {
            setIsAddReturn(false);
          }
          return slice.dialogActions.setIsChangeDialogOpen(open);
        },
        setIsDeleteDialogOpen: (open) => slice.dialogActions.setIsDeleteDialogOpen(open),
        refresh: slice.entityActions.refresh,
        setCurrentPage: (page) => slice.entityActions.setCurrentPage(page)
      } }
      ChangeDialog={ 
        <ChangeInvoiceDialog
          entity={ invoiceDialogState.selectedRow || undefined }
          mode={ isAddReturn ? "return" : invoiceDialogState.selectedRow ? "update" : "create" }
          service={ service }
          slice={ slice }
          stateKey={ stateKey }
          selectFormState={ selectFormState }
          fixedType={ fixedType }
          accountSlice={ accountSlice }
          accountState={ accountState }
          onSuccess={ (data, mode) =>
          {
            dispatch(slice.entityActions.refresh({ data: data }));
            if (mode === "create" || mode === "return")
            {
              setIsAddReturn(false);
              dispatch(slice.dialogActions.setIsChangeDialogOpen(false));
            }
          } }
        />
       }
      dorpdownItems={ (entity) => getActions(entity, DropdownMenuItem) }
      contextMenuItems={ (entity) => getActions(entity, ContextMenuItem) }
    />
  );
}

const getInvoiceTypeName = (type: InvoiceType) =>
{
  switch (type)
  {
    case InvoiceType.Sell:
      return "مبيعات";
    case InvoiceType.Purchase:
      return "مشتريات";
    case InvoiceType.SellReturn:
      return "مرتجع مبيعات";
    case InvoiceType.Quotation:
      return "عرض سعر";
    case InvoiceType.PurchaseReturn:
      return "مرتجع مشتريات";
    default:
      return "غير معروف";
  }
};
