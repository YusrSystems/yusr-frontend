import type { TFunction } from "i18next";
import { Copy, FileTextIcon, RotateCw, Undo2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Button, ContextMenuItem, CrudPage, CurrencyIcon, DropdownMenuItem, FilterCondition, type IDialogState, type IEntityState, selectPermissionsByResource, SystemPermissions, SystemPermissionsActions, Tooltip, TooltipContent, TooltipTrigger } from "yusr-ui";
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
import { useInvoiceLogic } from "./logic/useInvoiceLogic";
import AlertConvertDialog from "./presentation/dialogs/alertConvertDialog";

// ─── helper ──────────────────────────────────────────────────────────────────

function buildCopyEntity(source: Invoice): Invoice
{
  return {
    ...source,
    id: 0,
    date: new Date().toLocaleDateString("en-CA"),
    statusId: InvoiceStatus.Valid,
    eInvoiceStatus: EInvoiceStatus.NotSent,
    paidAmount: source.paidAmount,
    fullAmount: source.fullAmount,
    invoiceItems: (source.invoiceItems ?? []).map((item) => ({ ...item, id: 0, invoiceId: 0 })),
    invoiceVouchers: (source.invoiceVouchers ?? []).map((voucher) => ({ ...voucher, voucherId: 0, invoiceId: 0 }))
  };
}

// ─────────────────────────────────────────────────────────────────────────────

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
  const { t } = useTranslation(["accounting", "common"]);
  const dispatch = useAppDispatch();
  const [condition, setCondition] = useState<FilterCondition<Invoice> | undefined>(undefined);
  const [isAddReturn, setIsAddReturn] = useState<boolean>(false);
  const [copiedEntity, setCopiedEntity] = useState<Invoice | undefined>(undefined);
  const invoiceState = useAppSelector((state) => state[stateKey] as IEntityState<Invoice>);
  const authState = useAppSelector((state) => state.auth);
  const invoiceDialogState = useAppSelector((state) => state[dialogStateKey] as IDialogState<Invoice>);
  const [resendingEInvoice, setResendingEInvoice] = useState(false);
  const { createInitialPaymentVoucher } = useInvoiceLogic(authState);

  const permissions = useAppSelector((state) =>
    selectPermissionsByResource(state, SystemPermissionsResources.Invoices)
  );

  const isCopy = copiedEntity !== undefined;

  const getPaymentStatus = (invoice: Invoice): { message: string; styles: string; } =>
  {
    if (invoice.paidAmount === 0)
    {
      return { message: t("invoices.notPaid"), styles: "bg-red-100 text-red-800" };
    }

    if (invoice.paidAmount === invoice.fullAmount)
    {
      return { message: t("invoices.fullyPaid"), styles: "bg-green-100 text-green-800" };
    }

    if (invoice.paidAmount > invoice.fullAmount)
    {
      return { message: t("invoices.overpaid"), styles: "bg-red-100 text-red-800" };
    }

    return {
      message: t("invoices.partiallyPaid", { amount: invoice.paidAmount, currency: authState.setting?.currency?.code }),
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
      return { message: t("invoices.notSent"), styles: "bg-red-100 text-red-800" };
    }

    if (invoice.eInvoiceStatus === EInvoiceStatus.SentWithWarnings)
    {
      return { message: t("invoices.sentWithWarnings"), styles: "bg-orange-100 text-orange-800" };
    }

    if (invoice.eInvoiceStatus === EInvoiceStatus.SentCorrectly)
    {
      return { message: t("invoices.sent"), styles: "bg-green-100 text-green-800" };
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

    if (entity.type === InvoiceType.Sell || entity.type === InvoiceType.Purchase)
    {
      items.push(
        <ItemComponent
          key="return"
          onSelect={ () =>
          {
            setIsAddReturn(true);
            setCopiedEntity(undefined);
            dispatch(slice.dialogActions.openChangeDialog(entity));
          } }
        >
          <Undo2 className="h-4 w-4 ml-2" />
          { t("invoices.return") }
        </ItemComponent>
      );
    }

    if (permissions.addPermission)
    {
      items.push(
        <ItemComponent
          key="copy"
          onSelect={ async () =>
          {
            try
            {
              // Fetch full entity from backend because the table row might not have all details
              const res = await service.Get(entity.id);

              if (res?.data)
              {
                setIsAddReturn(false);
                setCopiedEntity(buildCopyEntity(res.data));
                dispatch(slice.dialogActions.setIsChangeDialogOpen(true));
              }
              else
              {
                toast.error(t("invoices.invoiceNotFound"));
              }
            }
            catch (error)
            {
              console.error("Failed to fetch full invoice for copying", error);
              toast.error(t("invoices.invoiceNotFound"));
            }
          } }
        >
          <Copy className="h-4 w-4 ml-2" />
          { t("invoices.copyInvoice") }
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
        toast.error(t("invoices.resendFailed"));
      }
      else
      {
        toast.success(t("invoices.resendSuccess"));
      }
      dispatch(slice.entityActions.refresh({ data: { ...invoice, eInvoiceStatus: res.data } }));
    }
    setResendingEInvoice(false);
  };

  // Resolve which entity to pass to the dialog
  const dialogEntity = isCopy ? copiedEntity : (invoiceDialogState.selectedRow || undefined);

  // Resolve the dialog mode
  const dialogMode = isAddReturn ? "return" : (isCopy || !invoiceDialogState.selectedRow) ? "create" : "update";

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
          toast.error(t("invoices.invoiceNotFound"));
          return;
        }

        dispatch(slice.dialogActions.openChangeDialog(invoice));
      } }
      title={ title }
      entityName={ t("invoices.entityName") }
      addNewItemTitle={ t("invoices.addNewTitle") }
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
        deletePermission: permissions.deletePermission
      } }
      perRowPermissions={ (entity) =>
      {
        return {
          getPermission: permissions.getPermission,
          addPermission: permissions.addPermission,
          updatePermission: permissions.updatePermission,
          deletePermission: entity.type === InvoiceType.Quotation ? permissions.deletePermission : false
        };
      } }
      hasPagePermission={ hasPagePermission }
      entityState={ invoiceState }
      useSlice={ () => invoiceDialogState }
      service={ service }
      cards={ [{
        title: t("invoices.totalInvoices"),
        data: (invoiceState.entities?.count ?? 0).toString(),
        icon: <FileTextIcon className="h-4 w-4 text-muted-foreground" />
      }] }
      columnsToFilter={ InvoiceFilterColumns.columnsNames(t) }
      tableHeadRows={ [
        { rowName: "", rowStyles: "text-left w-12.5" },
        { rowName: t("invoices.invoiceId"), rowStyles: "w-24" },
        { rowName: t("invoices.type"), rowStyles: "w-32" },
        { rowName: t("invoices.date"), rowStyles: "w-32" },
        { rowName: t("invoices.account"), rowStyles: "w-48" },
        { rowName: t("invoices.store"), rowStyles: "w-32" },
        { rowName: t("invoices.total"), rowStyles: "w-32" },
        { rowName: t("invoices.status"), rowStyles: "w-32" },
        { rowName: "", rowStyles: "w-32" },
        { rowName: "", rowStyles: "w-32" },
        ...(authState.setting?.eInvoicingEnvironmentType !== EInvoicingEnvironmentType.NotRegistered
          ? [{ rowName: t("invoices.eInvoiceStatus"), rowStyles: "w-50" }]
          : []),
        ...(SystemPermissions.hasAuth(
            authState.loggedInUser?.role?.permissions ?? [],
            SystemPermissionsResources.ReportInvoice,
            SystemPermissionsActions.Get
          )
          ? [{ rowName: "", rowStyles: "w-32" }]
          : [])
      ] }
      tableRowMapper={ (
        invoice: Invoice
      ) => [
        { rowName: `#${invoice.id}`, rowStyles: "" },
        { rowName: getInvoiceTypeName(invoice.type, t), rowStyles: "font-semibold" },
        { rowName: new Date(invoice.date).toLocaleDateString("en-CA"), rowStyles: "" },
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
          rowName: invoice.statusId === InvoiceStatus.Valid ? t("invoices.valid") : t("invoices.deleted"),
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
        {
          rowName: (
            <div>
              { invoice.type === InvoiceType.Quotation && (
                <AlertConvertDialog
                  invoiceId={ invoice.id }
                  createInitialPaymentVoucher={ () => createInitialPaymentVoucher(invoice) }
                  onSuccess={ (data) =>
                  {
                    dispatch(slice.formActions.updateFormData(data));
                    dispatch(slice.entityActions.refresh({ data: data }));
                  } }
                />
              ) }
            </div>
          ),
          rowStyles: ""
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
                      <p>{ t("invoices.resendTooltip") }</p>
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
          setCopiedEntity(undefined);
          return dispatch(slice.dialogActions.openChangeDialog(entity));
        },
        openDeleteDialog: (entity) => slice.dialogActions.openDeleteDialog(entity),
        setIsChangeDialogOpen: (open) =>
        {
          if (!open)
          {
            setIsAddReturn(false);
            setCopiedEntity(undefined);
          }
          return slice.dialogActions.setIsChangeDialogOpen(open);
        },
        setIsDeleteDialogOpen: (open) => slice.dialogActions.setIsDeleteDialogOpen(open),
        refresh: slice.entityActions.refresh,
        setCurrentPage: (page) => slice.entityActions.setCurrentPage(page)
      } }
      ChangeDialog={ 
        <ChangeInvoiceDialog
          entity={ dialogEntity }
          mode={ dialogMode }
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
              setCopiedEntity(undefined);
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

const getInvoiceTypeName = (type: InvoiceType, t: TFunction<"accounting">) =>
{
  switch (type)
  {
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
