import { Package } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { CrudPage, FilterCondition, ImagePreview, selectPermissionsByResource, SystemPermissions, SystemPermissionsActions } from "yusr-ui";
import { SystemPermissionsResources } from "../../core/auth/systemPermissionsResources";
import Item, { ItemFilterColumns, ItemSlice, ItemType } from "../../core/data/item";
import ReportConstants from "../../core/data/report/reportConstants";
import { StoreSlice } from "../../core/data/store";
import ItemsApiService from "../../core/networking/itemApiService";
import { useAppDispatch, useAppSelector } from "../../core/state/store";
import ItemStatementButton from "../reports/itemStatementDialog";
import ReportButton from "../reports/reportButton";
import ChangeItemDialog from "./changeItemDialog";

export default function ItemsPage()
{
  const { t } = useTranslation("stocking");
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state) => state.auth);
  const itemState = useAppSelector((state) => state.item);
  const itemDialogState = useAppSelector((state) => state.itemDialog);

  const permissions = useAppSelector((state) => selectPermissionsByResource(state, SystemPermissionsResources.Items));

  const service = useMemo(() => new ItemsApiService(), []);
  const [condition, setCondition] = useState<FilterCondition<Item> | undefined>(undefined);

  useEffect(() =>
  {
    dispatch(StoreSlice.entityActions.filter());
  }, []);

  return (
    <CrudPage<Item>
      title={ t("items.title") }
      entityName={ t("items.entityName") }
      addNewItemTitle={ t("items.addNewTitle") }
      onConditionChange={ setCondition }
      actionButtons={ SystemPermissions.hasAuth(
          authState.loggedInUser?.role?.permissions ?? [],
          SystemPermissionsResources.ReportItemList,
          SystemPermissionsActions.Get
        )
        ? [
          <ReportButton
            reportName={ ReportConstants.ItemsList }
            request={ { condition: condition } }
          />
        ]
        : [] }
      permissions={ permissions }
      hasPagePermission={ SystemPermissions.hasAuth(
        authState.loggedInUser?.role?.permissions ?? [],
        SystemPermissionsResources.Items,
        SystemPermissionsActions.Get
      ) }
      entityState={ itemState }
      useSlice={ () => itemDialogState }
      service={ service }
      cards={ [{
        title: t("items.totalItems"),
        data: (itemState.entities?.count ?? 0).toString(),
        icon: <Package className="h-4 w-4 text-muted-foreground" />
      }] }
      columnsToFilter={ ItemFilterColumns.columnsNames(t) }
      tableHeadRows={ [
        { rowName: "", rowStyles: "text-left w-12.5" },
        { rowName: t("items.itemId"), rowStyles: "w-20" },
        { rowName: t("items.itemId"), rowStyles: "w-20" },
        { rowName: t("items.itemType"), rowStyles: "w-24" },
        { rowName: t("items.itemName"), rowStyles: "w-48" },
        { rowName: t("items.class"), rowStyles: "w-32" },
        { rowName: t("items.brand"), rowStyles: "w-32" },
        { rowName: t("items.quantity"), rowStyles: "w-24" },
        ...(SystemPermissions.hasAuth(
            authState.loggedInUser?.role?.permissions ?? [],
            SystemPermissionsResources.ReportItemStatement,
            SystemPermissionsActions.Get
          )
          ? [{ rowName: "", rowStyles: "w-32" }]
          : [])
      ] }
      tableRowMapper={ (item: Item) => [
        { rowName: `#${item.id}`, rowStyles: "" },
        {
          rowName: (
            <ImagePreview
              files={ item.itemImages }
              size={ 40 }
              fallback={ 
                <div className="w-10 h-10 rounded bg-muted flex items-center justify-center">
                  <Package className="w-4 h-4 text-muted-foreground" />
                </div>
               }
            />
          ),
          rowStyles: ""
        },
        {
          rowName: item.type === ItemType.Product ? t("items.product") : t("items.service"),
          rowStyles: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            item.type === ItemType.Product
              ? "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400"
              : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
          }`
        },
        { rowName: item.name, rowStyles: "font-semibold" },
        { rowName: item.class ?? "-", rowStyles: "text-sm text-gray-500" },
        { rowName: item.brand ?? "-", rowStyles: "text-sm text-gray-500" },
        { rowName: item.quantity?.toString() ?? "0", rowStyles: "font-mono" },
        ...(SystemPermissions.hasAuth(
            authState.loggedInUser?.role?.permissions ?? [],
            SystemPermissionsResources.ReportAccountStatement,
            SystemPermissionsActions.Get
          )
          ? [{ rowName: <ItemStatementButton item={ item } />, rowStyles: "w-32" }]
          : [])
      ] }
      actions={ {
        filter: ItemSlice.entityActions.filter,
        openChangeDialog: (entity) => ItemSlice.dialogActions.openChangeDialog(entity),
        openDeleteDialog: (entity) => ItemSlice.dialogActions.openDeleteDialog(entity),
        setIsChangeDialogOpen: (open) => ItemSlice.dialogActions.setIsChangeDialogOpen(open),
        setIsDeleteDialogOpen: (open) => ItemSlice.dialogActions.setIsDeleteDialogOpen(open),
        refresh: ItemSlice.entityActions.refresh,
        setCurrentPage: (page) => ItemSlice.entityActions.setCurrentPage(page)
      } }
      ChangeDialog={ 
        <ChangeItemDialog
          entity={ itemDialogState.selectedRow || undefined }
          mode={ itemDialogState.selectedRow ? "update" : "create" }
          service={ service }
          onSuccess={ (data, mode) =>
          {
            dispatch(ItemSlice.entityActions.refresh({ data: data }));
            if (mode === "create")
            {
              dispatch(ItemSlice.dialogActions.setIsChangeDialogOpen(false));
            }
          } }
        />
       }
    />
  );
}
