import type { PricingMethodDto } from "@/core/data/pricingMethod";
import PricingMethod from "@/core/data/pricingMethod";
import { Cubits } from "@/core/services/cubits";
import { Services } from "@/core/services/services";
import { useSignals } from "@preact/signals-react/runtime";
import { TagIcon } from "lucide-react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { CrudPage, PageError, PageLoaded, PageLoading, SystemPermissionsActions, TablePreview, UnauthorizedPage } from "yusr-ui";
import { SystemPermissionsResources } from "../../core/auth/systemPermissionsResources";
import ChangePricingMethodDialog from "./changePricingMethodDialog";

export default function PricingMethodsPage()
{
  if (!Services.auth.hasAuth(SystemPermissionsResources.PricingMethods, SystemPermissionsActions.Get))
  {
    return <UnauthorizedPage />;
  }

  const { t } = useTranslation("stocking");

  useEffect(() => Cubits.pricingMethods.init(), []);

  return (
    <CrudPage>
      <CrudPage.Header
        title={ t("pricingMethods.title") }
        addButtonTitle={ t("pricingMethods.addNewTitle") }
        isAddButtonVisible={ Services.auth.hasAuth(
          SystemPermissionsResources.PricingMethods,
          SystemPermissionsActions.Add
        ) }
      />
      <Cards />

      <CrudPage.SearchInput onSearch={ (searchText) => Cubits.pricingMethods.search(searchText) } />

      <PageTable />

      <CrudPage.ChangeDialog
        changeDialog={ (dto: PricingMethodDto | undefined, closeDialog) =>
        {
          return (
            <ChangePricingMethodDialog
              entity={ dto
                ? PricingMethod.load(dto)
                : PricingMethod.create() }
              service={ Services.pricingMethodsApi }
              onSuccess={ (data) =>
              {
                if (data.mode.value === "create")
                {
                  Cubits.pricingMethods.add(data);
                  closeDialog();
                }
                else if (data.mode.value === "update")
                {
                  Cubits.pricingMethods.update(data);
                }
              } }
            />
          );
        } }
      />

      <CrudPage.DeleteDialog
        entityNameSelector={ (pricingMethod) => pricingMethod.name }
        service={ Services.pricingMethodsApi }
        onSuccess={ (entity) => Cubits.pricingMethods.delete(entity) }
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
        title: t("pricingMethods.totalMethods"),
        data: (Cubits.pricingMethods.count.value ?? 0).toString(),
        icon: <TagIcon className="h-4 w-4 text-muted-foreground" />
      }] }
    />
  );
}

function PageTable()
{
  useSignals();
  const { t } = useTranslation(["stocking", "common"]);

  if (Cubits.pricingMethods.state.value instanceof PageLoading)
  {
    return <TablePreview.Loading />;
  }

  if (Cubits.pricingMethods.state.value instanceof PageLoaded)
  {
    return (
      <CrudPage.Table>
        <CrudPage.TableBody<PricingMethod, PricingMethodDto>
          data={ Cubits.pricingMethods.entities.value }
          headerRows={ [{ rowBody: "", rowStyles: "text-left w-12.5" }, {
            rowBody: t("pricingMethods.methodId"),
            rowStyles: "w-30"
          }, { rowBody: t("pricingMethods.methodName"), rowStyles: "w-70" }] }
          tableRowMapper={ (
            pricingMethod
          ) => [{ rowBody: `#${pricingMethod.id}`, rowStyles: "" }, {
            rowBody: pricingMethod.name,
            rowStyles: "font-semibold"
          }] }
          hasUpdatePermission={ Services.auth.hasAuth(
            SystemPermissionsResources.PricingMethods,
            SystemPermissionsActions.Update
          ) }
          hasDeletePermission={ Services.auth.hasAuth(
            SystemPermissionsResources.PricingMethods,
            SystemPermissionsActions.Delete
          ) }
        />
        <CrudPage.TablePagination
          pageSize={ Cubits.pricingMethods.pageSize.value }
          totalNumber={ Cubits.pricingMethods.count.value }
          currentPage={ Cubits.pricingMethods.currentPage.value }
          onPageChanged={ (newPage) =>
          {
            Cubits.pricingMethods.changePage(newPage);
          } }
        />
      </CrudPage.Table>
    );
  }

  if (Cubits.pricingMethods.state.value instanceof PageError)
  {
    return <TablePreview.Error />;
  }

  return <TablePreview.Empty />;
}
