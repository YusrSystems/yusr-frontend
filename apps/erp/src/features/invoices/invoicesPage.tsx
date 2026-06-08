import VerfiAccountWrapper from "@/core/components/verfiAccountWrapper";
import type { TFunction } from "i18next";
import { Copy, FilePlusCorner, FileTextIcon, RotateCw, Undo2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Button, ContextMenuItem, CrudPageOld, CurrencyIcon, DropdownMenuItem, type IDialogState, type IEntityState, selectPermissionsByResource, SystemPermissions, SystemPermissionsActions, type TableBodyRowInfo, Tooltip, TooltipContent, TooltipTrigger } from "yusr-ui";
import { SystemPermissionsResources } from "../../core/auth/systemPermissionsResources";
import type Account from "../../core/data/account";
import type { AccountSliceType } from "../../core/data/account";
import Invoice, { EInvoiceStatus, InvoiceSlice, InvoiceStatus, InvoiceType } from "../../core/data/invoice";
import { InvoicesListReportRequest, InvoicesListReportType } from "../../core/data/report/invoicesListReportType";
import ReportConstants from "../../core/data/report/reportConstants";
import { EInvoicingEnvironmentType } from "../../core/data/settingOld";
import InvoicesApiService from "../../core/networking/invoiceApiService";
import { type RootState, useAppDispatch, useAppSelector } from "../../core/state/store";
import ReportButton from "../reports/reportButton";
import ChangeInvoiceDialog, { type InvoiceDialogMode } from "./changeInvoiceDialog";

export default function InvoicesPage({
  entityName,
  addNewItemTitle,
  totalInvoicesTitle,
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
  entityName?: string;
  addNewItemTitle?: string;
  totalInvoicesTitle?: string;
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
  const [searchText, setSearchText] = useState<string | undefined>(undefined);
  const [customMode, setCustomMode] = useState<InvoiceDialogMode | undefined>(undefined);
  const invoiceState = useAppSelector((state) => state[stateKey] as IEntityState<Invoice>);
  const authState = useAppSelector((state) => state.auth);
  const invoiceDialogState = useAppSelector((state) => state[dialogStateKey] as IDialogState<Invoice>);
  const [resendingEInvoice, setResendingEInvoice] = useState(false);

  const permissions = useAppSelector((state) =>
    selectPermissionsByResource(state, SystemPermissionsResources.Invoices)
  );

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
          className="text-orange-700 font-semibold"
          onSelect={ () =>
          {
            setCustomMode("return");
            dispatch(slice.dialogActions.openChangeDialog(entity));
          } }
        >
          <Undo2 className="h-4 w-4 me-2" />
          <h4 className="text-sm">{ t("invoices.return") }</h4>
        </ItemComponent>
      );

      items.push(
        <ItemComponent
          className="text-blue-600 font-semibold"
          onSelect={ () =>
          {
            setCustomMode("copy");

            dispatch(slice.dialogActions.openChangeDialog(entity));
          } }
        >
          <Copy className="h-4 w-4 me-2" />
          { t("invoices.copyInvoice") }
        </ItemComponent>
      );
    }

    if (entity.type === InvoiceType.Quotation)
    {
      items.push(
        <ItemComponent
          className="text-green-600 font-semibold"
          onSelect={ () =>
          {
            setCustomMode("quotationToSales");

            dispatch(slice.dialogActions.openChangeDialog(entity));
          } }
        >
          <FilePlusCorner className="h-4 w-4 me-2" />
          { t("invoices.convertToSales") }
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

  const getTableHeadRows = () =>
  {
    const rows = [{ rowName: "", rowStyles: "text-left w-12.5" }, {
      rowName: t("invoices.invoiceId"),
      rowStyles: "w-24"
    }];

    if (fixedType === InvoiceType.Quotation)
    {
      rows.push({ rowName: t("invoices.notes"), rowStyles: "w-32" });
    }
    else
    {
      rows.push({ rowName: t("invoices.type"), rowStyles: "w-32" });
    }

    rows.push(
      { rowName: t("invoices.date"), rowStyles: "w-32" },
      { rowName: t("invoices.account"), rowStyles: "w-48" },
      { rowName: t("invoices.store"), rowStyles: "w-32" },
      { rowName: t("invoices.total"), rowStyles: "w-32" }
    );

    if (fixedType === InvoiceType.Sell)
    {
      rows.push(
        { rowName: t("invoices.status"), rowStyles: "w-32" },
        { rowName: "", rowStyles: "w-32" }
      );
    }

    if (
      authState.setting?.eInvoicingEnvironmentType !== EInvoicingEnvironmentType.NotRegistered
      && fixedType === InvoiceType.Sell
    )
    {
      rows.push({ rowName: t("invoices.eInvoiceStatus"), rowStyles: "w-50" });
    }

    if (
      SystemPermissions.hasAuth(
        authState.loggedInUser?.role?.permissions ?? [],
        SystemPermissionsResources.ReportInvoice,
        SystemPermissionsActions.Get
      )
    )
    {
      rows.push({ rowName: "", rowStyles: "w-32" });
    }

    return rows;
  };

  const getTableRowMapper = (invoice: Invoice) =>
  {
    const cells: TableBodyRowInfo[] = [{ rowName: `#${invoice.id}`, rowStyles: "" }];

    if (fixedType === InvoiceType.Quotation)
    {
      cells.push({ rowName: invoice.notes, rowStyles: "font-semibold" });
    }
    else
    {
      cells.push({ rowName: getInvoiceTypeName(invoice.type, t), rowStyles: "font-semibold" });
    }

    cells.push(
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
      }
    );

    if (fixedType === InvoiceType.Sell)
    {
      cells.push(
        {
          rowName: invoice.statusId === InvoiceStatus.Valid
            ? t("invoices.valid")
            : t("invoices.deleted"),
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
        }
      );
    }

    if (
      authState.setting?.eInvoicingEnvironmentType !== EInvoicingEnvironmentType.NotRegistered
      && fixedType === InvoiceType.Sell
    )
    {
      cells.push({
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
        rowStyles: ""
      });
    }

    if (
      SystemPermissions.hasAuth(
        authState.loggedInUser?.role?.permissions ?? [],
        SystemPermissionsResources.ReportAccountStatement,
        SystemPermissionsActions.Get
      ) && invoice.statusId === InvoiceStatus.Valid
    )
    {
      cells.push({
        rowName: (
          <ReportButton
            reportName={ ReportConstants.Invoice }
            request={ { invoiceId: invoice.id } }
            fileName={ `${invoice.id}-${getInvoiceTypeName(invoice.type, t)}-${invoice.actionAccountName}` }
          />
        ),
        rowStyles: "w-32"
      });
    }

    return cells;
  };

  return (
    <VerfiAccountWrapper>
      <CrudPageOld<Invoice>
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
        entityName={ entityName ?? t("invoices.entityName") }
        addNewItemTitle={ addNewItemTitle ?? t("invoices.addNewTitle") }
        onSearchTextChange={ setSearchText }
        actionButtons={ SystemPermissions.hasAuth(
            authState.loggedInUser?.role?.permissions ?? [],
            SystemPermissionsResources.ReportInvoiceList,
            SystemPermissionsActions.Get
          )
          ? [
            <ReportButton<InvoicesListReportRequest>
              reportName={ ReportConstants.InvoicesList }
              request={ {
                types: fixedType === InvoiceType.Sell
                  ? [InvoiceType.Sell, InvoiceType.SellReturn, InvoiceType.Quotation]
                  : [InvoiceType.Purchase, InvoiceType.PurchaseReturn],
                searchText: searchText,
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
          title: totalInvoicesTitle ?? t("invoices.totalInvoices"),
          data: (invoiceState.entities?.count ?? 0).toString(),
          icon: <FileTextIcon className="h-4 w-4 text-muted-foreground" />
        }] }
        tableHeadRows={ getTableHeadRows() }
        tableRowMapper={ (invoice: Invoice) => getTableRowMapper(invoice) }
        actions={ {
          filter: slice.entityActions.filter,
          openChangeDialog: (entity) =>
          {
            setCustomMode(undefined);
            return dispatch(slice.dialogActions.openChangeDialog(entity));
          },
          openDeleteDialog: (entity) => slice.dialogActions.openDeleteDialog(entity),
          setIsChangeDialogOpen: (open) =>
          {
            if (!open)
            {
              setCustomMode(undefined);
            }
            return slice.dialogActions.setIsChangeDialogOpen(open);
          },
          setIsDeleteDialogOpen: (open) => slice.dialogActions.setIsDeleteDialogOpen(open),
          refresh: slice.entityActions.refresh,
          setCurrentPage: (page) => slice.entityActions.setCurrentPage(page)
        } }
        ChangeDialog={ 
          <ChangeInvoiceDialog
            entity={ customMode === "quotationToSales"
              ? ({ ...invoiceDialogState.selectedRow, type: InvoiceType.Sell } as Invoice)
              : (invoiceDialogState.selectedRow || undefined) }
            mode={ customMode ?? (invoiceDialogState.selectedRow ? "update" : "create") }
            service={ service }
            slice={ slice }
            stateKey={ stateKey }
            selectFormState={ selectFormState }
            fixedType={ customMode === "quotationToSales" ? InvoiceType.Sell : fixedType }
            accountSlice={ accountSlice }
            accountState={ accountState }
            onSuccess={ (data, mode) =>
            {
              dispatch(slice.entityActions.refresh({ data: data }));
              if (mode === "create" || mode === "return")
              {
                setCustomMode(undefined);
                dispatch(slice.dialogActions.setIsChangeDialogOpen(false));
              }
            } }
          />
         }
        dorpdownItems={ (entity) => getActions(entity, DropdownMenuItem) }
        contextMenuItems={ (entity) => getActions(entity, ContextMenuItem) }
      />
    </VerfiAccountWrapper>
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
