import type { ItemDto } from "@/core/data/item";
import Item from "@/core/data/item";
import type { ItemsListReportRequest } from "@/core/data/report/itemsListReportRequest";
import { Cubits } from "@/core/services/cubits";
import { Services } from "@/core/services/services";
import { signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import { Package } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { CrudPage, ImagePreview, PageError, PageLoaded, PageLoading, SystemPermissionsActions, TablePreview, UnauthorizedPage } from "yusr-ui";
import { SystemPermissionsResources } from "../../core/auth/systemPermissionsResources";
import { ItemType } from "../../core/data/itemOld";
import ReportConstants from "../../core/data/report/reportConstants";
import ItemStatementButton from "../reports/itemStatementDialog";
import ReportButton from "../reports/reportButton";
import ChangeItemDialog from "./changeItemDialog";

export default function ItemsPage()
{
  if (!Services.auth.hasAuth(SystemPermissionsResources.Items, SystemPermissionsActions.Get))
  {
    return <UnauthorizedPage />;
  }

  const { t } = useTranslation("stocking");
  const searchText = useMemo(() => signal<string | undefined>(""), []);

  useEffect(() => Cubits.items.init(), []);

  return (
    <CrudPage>
      <CrudPage.Header
        title={ t("items.title") }
        addButtonTitle={ t("items.addNewTitle") }
        isAddButtonVisible={ Services.auth.hasAuth(SystemPermissionsResources.Items, SystemPermissionsActions.Add) }
        actionButtons={ Services.auth.hasAuth(
            SystemPermissionsResources.ReportItemList,
            SystemPermissionsActions.Get
          )
          ? [
            <ReportButton<ItemsListReportRequest>
              reportName={ ReportConstants.ItemsList }
              request={ { searchText: searchText.value } }
            />
          ]
          : [] }
      />

      <Cards />

      <CrudPage.SearchInput
        onSearch={ (text) =>
        {
          searchText.value = text;
          Cubits.items.search(text);
        } }
      />

      <PageTable />

      <CrudPage.ChangeDialog
        changeDialog={ (dto, closeDialog) =>
        {
          return (
            <ChangeItemDialog
              entity={ dto
                ? Item.load(dto)
                : Item.create({
                  id: 0,
                  type: ItemType.Product,
                  name: "",
                  description: "",
                  class: "",
                  brand: "",
                  sellUnitId: 0,
                  sellUnitName: "",
                  minQuantity: 0,
                  maxQuantity: 0,
                  initialQuantity: 0,
                  quantity: 0,
                  storeQuantity: 0,
                  lastBuyPrice: 0,
                  initialCost: 0,
                  cost: 0,
                  taxIncluded: false,
                  taxable: false,
                  exemptionReasonCode: "",
                  exemptionReason: "",
                  statusId: 1,
                  location: "",
                  notes: "",
                  totalTaxes: 0,
                  itemUnitPricingMethods: [],
                  itemTaxes: [],
                  itemStores: [],
                  itemImages: []
                }) }
              service={ Services.itemsApi }
              onSuccess={ (data) =>
              {
                if (data.mode.value === "create")
                {
                  Cubits.items.add(data);
                  closeDialog();
                }
                else if (data.mode.value === "update")
                {
                  Cubits.items.update(data);
                }
              } }
            />
          );
        } }
      />

      <CrudPage.DeleteDialog
        entityNameSelector={ (item) => item.name }
        service={ Services.itemsApi }
        onSuccess={ (entity) => Cubits.items.delete(entity) }
      />
    </CrudPage>
  );

  function Cards()
  {
    useSignals();
    const { t } = useTranslation("stocking");
    return (
      <CrudPage.Cards
        cards={ [{
          title: t("items.totalItems"),
          data: (Cubits.items.count.value ?? 0).toString(),
          icon: <Package className="h-4 w-4 text-muted-foreground" />
        }] }
      />
    );
  }
}

function PageTable()
{
  useSignals();
  const { t } = useTranslation(["stocking", "common"]);

  if (Cubits.items.state.value instanceof PageLoading)
  {
    return <TablePreview.Loading />;
  }

  if (Cubits.items.state.value instanceof PageLoaded)
  {
    return (
      <CrudPage.Table>
        <CrudPage.TableBody<Item, ItemDto>
          data={ Cubits.items.entities.value }
          headerRows={ [
            { rowBody: "", rowStyles: "text-left w-12.5" },
            { rowBody: t("items.itemId"), rowStyles: "w-20" },
            { rowBody: t("items.itemId"), rowStyles: "w-20" },
            { rowBody: t("items.itemType"), rowStyles: "w-24" },
            { rowBody: t("items.itemName"), rowStyles: "w-48" },
            { rowBody: t("items.class"), rowStyles: "w-32" },
            { rowBody: t("items.brand"), rowStyles: "w-32" },
            { rowBody: t("items.quantity"), rowStyles: "w-24" },
            ...(Services.auth.hasAuth(
                SystemPermissionsResources.ReportItemStatement,
                SystemPermissionsActions.Get
              )
              ? [{ rowBody: "", rowStyles: "w-32" }]
              : [])
          ] }
          tableRowMapper={ (
            item
          ) => [
            { rowBody: `#${item.id}`, rowStyles: "" },
            {
              rowBody: (
                <ImagePreview
                  files={ item.itemImages.value }
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
              rowBody: item.type.value === ItemType.Product ? t("items.product") : t("items.service"),
              rowStyles: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                item.type.value === ItemType.Product
                  ? "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400"
                  : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
              }`
            },
            { rowBody: item.name, rowStyles: "font-semibold" },
            { rowBody: item.class ?? "-", rowStyles: "text-sm text-gray-500" },
            { rowBody: item.brand ?? "-", rowStyles: "text-sm text-gray-500" },
            { rowBody: item.quantity?.toString() ?? "0", rowStyles: "font-mono" },
            ...(Services.auth.hasAuth(
                SystemPermissionsResources.ReportAccountStatement,
                SystemPermissionsActions.Get
              )
              ? [{ rowBody: <ItemStatementButton item={ item } />, rowStyles: "w-32" }]
              : [])
          ] }
          hasUpdatePermission={ Services.auth.hasAuth(
            SystemPermissionsResources.Units,
            SystemPermissionsActions.Update
          ) }
          hasDeletePermission={ Services.auth.hasAuth(
            SystemPermissionsResources.Units,
            SystemPermissionsActions.Delete
          ) }
        />
        <CrudPage.TablePagination
          pageSize={ Cubits.items.pageSize.value }
          totalNumber={ Cubits.items.count.value }
          currentPage={ Cubits.items.currentPage.value }
          onPageChanged={ (newPage) =>
          {
            Cubits.items.changePage(newPage);
          } }
        />
      </CrudPage.Table>
    );
  }

  if (Cubits.items.state.value instanceof PageError)
  {
    return <TablePreview.Error />;
  }

  return <TablePreview.Empty />;
}
