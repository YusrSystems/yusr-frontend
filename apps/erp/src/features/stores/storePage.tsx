import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources";
import { Store, type StoreDto } from "@/core/data/store";
import { Services } from "@/core/services/services";
import { useSignals } from "@preact/signals-react/runtime";
import { Warehouse } from "lucide-react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { CrudPage, PageCubit, PageError, PageLoaded, PageLoading, SystemPermissionsActions, TablePreview, UnauthorizedPage } from "yusr-ui";
import ItemsListDialog from "../reports/itemsListDialog";
import ChangeStoreDialog from "./changeStoreDialog";

const cubit = new PageCubit<Store, StoreDto>(Services.storesApi);

export default function StoresPage()
{
  if (!Services.auth.hasAuth(SystemPermissionsResources.Stores, SystemPermissionsActions.Get))
  {
    return <UnauthorizedPage />;
  }

  const { t } = useTranslation("stocking");

  useEffect(() =>
  {
    cubit.init();
  }, []);

  return (
    <CrudPage>
      <CrudPage.Header
        title={ t("stores.title") }
        addButtonTitle={ t("stores.addNewTitle") }
        isAddButtonVisible={ Services.auth.hasAuth(SystemPermissionsResources.Stores, SystemPermissionsActions.Add) }
      />

      <Cards />

      <CrudPage.SearchInput onSearch={ (searchText) => cubit.search(searchText) } />

      <PageTable />

      <CrudPage.ChangeDialog
        changeDialog={ (dto, closeDialog) =>
        {
          return (
            <ChangeStoreDialog
              entity={ dto
                ? Store.load(dto)
                : Store.create({ id: 0, name: "", authorized: true }) }
              service={ Services.storesApi }
              onSuccess={ (data) =>
              {
                if (data.mode.value === "create")
                {
                  cubit.add(data);
                  closeDialog();
                }
                else if (data.mode.value === "update")
                {
                  cubit.update(data);
                }
              } }
            />
          );
        } }
      />

      <CrudPage.DeleteDialog
        entityNameSelector={ (store) => store.name }
        service={ Services.storesApi }
        onSuccess={ (entity) => cubit.delete(entity) }
      />
    </CrudPage>
  );
}

function Cards()
{
  useSignals();
  const { t } = useTranslation("stocking");
  return (
    <CrudPage.Cards
      cards={ [{
        title: t("stores.totalStores"),
        data: cubit.count.value.toString(),
        icon: <Warehouse className="h-4 w-4 text-muted-foreground" />
      }] }
    />
  );
}

function PageTable()
{
  useSignals();
  const { t } = useTranslation(["stocking", "common", "erpCommon"]);

  if (cubit.state.value instanceof PageLoading)
  {
    return <TablePreview.Loading />;
  }

  if (cubit.state.value instanceof PageLoaded)
  {
    return (
      <CrudPage.Table>
        <CrudPage.TableBody<Store, StoreDto>
          data={ cubit.entities.value }
          headerRows={ [
            { rowBody: "", rowStyles: "text-left w-12.5" },
            {
              rowBody: t("stores.storeId"),
              rowStyles: "w-30"
            },
            { rowBody: t("stores.storeName"), rowStyles: "w-70" },
            ...(Services.auth.hasAuth(
                SystemPermissionsResources.ReportItemList,
                SystemPermissionsActions.Get
              )
              ? [{ rowBody: "", rowStyles: "w-32" }]
              : [])
          ] }
          tableRowMapper={ (
            store
          ) => [
            { rowBody: `#${store.id}`, rowStyles: "" },
            { rowBody: store.name, rowStyles: "font-semibold" },
            ...(Services.auth.hasAuth(
                SystemPermissionsResources.ReportItemList,
                SystemPermissionsActions.Get
              )
              ? [{
                rowBody: <ItemsListDialog store={ store } buttonLabel={ t("erpCommon:reports.itemsList") } />,
                rowStyles: "w-32"
              }]
              : [])
          ] }
          hasUpdatePermission={ Services.auth.hasAuth(
            SystemPermissionsResources.Taxes,
            SystemPermissionsActions.Update
          ) }
          hasDeletePermission={ Services.auth.hasAuth(
            SystemPermissionsResources.Taxes,
            SystemPermissionsActions.Delete
          ) }
        />
        <CrudPage.TablePagination
          pageSize={ cubit.pageSize.value }
          totalNumber={ cubit.count.value }
          currentPage={ cubit.currentPage.value }
          onPageChanged={ (newPage) =>
          {
            cubit.changePage(newPage);
          } }
        />
      </CrudPage.Table>
    );
  }

  if (cubit.state.value instanceof PageError)
  {
    return <TablePreview.Error />;
  }

  return <TablePreview.Empty />;
}
