import { Package } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { CrudPage, FilterCondition, SystemPermissions } from "yusr-ui";
import { SystemPermissionsActions } from "../../../../../packages/yusr-ui/src/auth/systemPermissionsActions";
import { selectPermissionsByResource } from "../../core/auth/authSelectors";
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
      title="إدارة المواد"
      entityName="مادة"
      addNewItemTitle="إضافة مادة جديدة"
      onConditionChange={ setCondition }
      actionButtons={ SystemPermissions.hasAuth(
          authState.loggedInUser?.role?.permissions ?? [],
          SystemPermissionsResources.ReportItemList,
          SystemPermissionsActions.Get
        )
        ? [
          <ReportButton
            reportName={ ReportConstants.ItemsList }
            request={ {
              condition: condition
            } }
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
        title: "إجمالي المواد",
        data: (itemState.entities?.count ?? 0).toString(),
        icon: <Package className="h-4 w-4 text-muted-foreground" />
      }] }
      columnsToFilter={ ItemFilterColumns.columnsNames }
      tableHeadRows={ [
        { rowName: "", rowStyles: "text-left w-12.5" },
        { rowName: "رقم المادة", rowStyles: "w-12.5" },
        { rowName: "النوع", rowStyles: "w-24" },
        { rowName: "اسم المادة", rowStyles: "w-48" },
        { rowName: "الصنف", rowStyles: "w-32" },
        { rowName: "الكمية", rowStyles: "w-24" },
        { rowName: "التكلفة", rowStyles: "w-24" },
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
          rowName: item.type === ItemType.Product ? "منتج" : "خدمة",
          rowStyles: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            item.type === ItemType.Product
              ? "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400"
              : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
          }`
        },
        { rowName: item.name, rowStyles: "font-semibold" },
        { rowName: item.class ?? "-", rowStyles: "text-sm text-gray-500" },
        { rowName: item.quantity?.toString() ?? "0", rowStyles: "font-mono" },
        { rowName: item.cost?.toLocaleString() ?? "0", rowStyles: "font-mono text-green-600" },
        ...(SystemPermissions.hasAuth(
            authState.loggedInUser?.role?.permissions ?? [],
            SystemPermissionsResources.ReportAccountStatement,
            SystemPermissionsActions.Get
          )
          ? [{
            rowName: <ItemStatementButton item={ item } />,
            rowStyles: "w-32"
          }]
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
