import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources";
import { Tax, type TaxDto } from "@/core/data/tax";
import { Services } from "@/core/services/services";
import { useSignals } from "@preact/signals-react/runtime";
import { Percent } from "lucide-react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { CrudPage, PageCubit, PageError, PageLoaded, PageLoading, SystemPermissionsActions, TablePreview, UnauthorizedPage } from "yusr-ui";
import ChangeTaxDialog from "./changeTaxDialog";

const cubit = new PageCubit<Tax, TaxDto>(Services.taxesApi);

export default function TaxesPage()
{
  const { t } = useTranslation("accounting");

  if (!Services.auth.hasAuth(SystemPermissionsResources.Taxes, SystemPermissionsActions.Get))
  {
    return <UnauthorizedPage />;
  }

  useEffect(() =>
  {
    cubit.init();
  }, []);

  return (
    <CrudPage>
      <CrudPage.Header
        title={ t("taxes.title") }
        addButtonTitle={ t("taxes.addNewTitle") }
        isAddButtonVisible={ Services.auth.hasAuth(SystemPermissionsResources.Taxes, SystemPermissionsActions.Add) }
      />

      <Cards />

      <CrudPage.SearchInput onSearch={ (searchText) => cubit.search(searchText) } />

      <PageTable />

      <CrudPage.ChangeDialog
        changeDialog={ (dto) =>
        {
          return (
            <ChangeTaxDialog
              entity={ dto
                ? Tax.load(dto)
                : Tax.create({ id: 0, name: "", percentage: 1, isPrimary: false }) }
              service={ Services.taxesApi }
              onSuccess={ (data) =>
              {
                if (data.mode.value === "create")
                {
                  cubit.add(data);
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
        entityNameSelector={ (tax) => tax.name }
        service={ Services.taxesApi }
        onSuccess={ (entity) => cubit.delete(entity) }
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
        title: t("taxes.totalTaxes"),
        data: cubit.count.value.toString(),
        icon: <Percent className="h-4 w-4 text-muted-foreground" />
      }] }
    />
  );
}

function PageTable()
{
  useSignals();
  const { t } = useTranslation(["accounting", "common"]);

  if (cubit.state.value instanceof PageLoading)
  {
    return <TablePreview.Loading />;
  }

  if (cubit.state.value instanceof PageLoaded)
  {
    return (
      <CrudPage.Table>
        <CrudPage.TableBody<Tax, TaxDto>
          data={ cubit.entities.value }
          headerRows={ [
            { rowBody: "", rowStyles: "text-left w-12.5" },
            { rowBody: t("taxes.taxNumber"), rowStyles: "w-30" },
            { rowBody: t("taxes.taxName"), rowStyles: "w-50" },
            { rowBody: t("taxes.percentage"), rowStyles: "w-30" },
            { rowBody: t("taxes.isPrimary"), rowStyles: "" }
          ] }
          tableRowMapper={ (
            tax
          ) => [
            { rowBody: `#${tax.id.value}`, rowStyles: "" },
            { rowBody: tax.name.value, rowStyles: "font-semibold" },
            {
              rowBody: `%${tax.percentage.value}`,
              rowStyles: ""
            },
            {
              rowBody: tax.isPrimary.value ? t("common:yes") : t("common:no"),
              rowStyles: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                tax.isPrimary.value ? "bg-blue-300" : "bg-gray-200"
              } text-slate-800`
            }
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
