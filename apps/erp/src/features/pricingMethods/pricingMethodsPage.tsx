import type { PricingMethodDto } from "@/core/data/pricingMethod";
import PricingMethod from "@/core/data/pricingMethod";
import { Services } from "@/core/services/services";
import { useSignals } from "@preact/signals-react/runtime";
import { TagIcon } from "lucide-react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { CrudPage, PageCubit, PageError, PageLoaded, PageLoading, SystemPermissionsActions, TablePreview, UnauthorizedPage } from "yusr-ui";
import { SystemPermissionsResources } from "../../core/auth/systemPermissionsResources";
import ChangePricingMethodDialog from "./changePricingMethodDialog";

const cubit = new PageCubit<PricingMethod, PricingMethodDto>(Services.pricingMethodsApi);

export default function PricingMethodsPage()
{
  if (!Services.auth.hasAuth(SystemPermissionsResources.PricingMethods, SystemPermissionsActions.Get))
  {
    return <UnauthorizedPage />;
  }

  const { t } = useTranslation("stocking");

  useEffect(() => cubit.init(), []);

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

      <CrudPage.SearchInput onSearch={ (searchText) => cubit.search(searchText) } />

      <PageTable />

      <CrudPage.ChangeDialog
        changeDialog={ (dto, closeDialog) =>
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
        entityNameSelector={ (pricingMethod) => pricingMethod.name }
        service={ Services.pricingMethodsApi }
        onSuccess={ (entity) => cubit.delete(entity) }
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
          title: t("pricingMethods.totalMethods"),
          data: (cubit.count.value ?? 0).toString(),
          icon: <TagIcon className="h-4 w-4 text-muted-foreground" />
        }] }
      />
    );
  }
}

function PageTable()
{
  useSignals();
  const { t } = useTranslation(["stocking", "common"]);

  if (cubit.state.value instanceof PageLoading)
  {
    return <TablePreview.Loading />;
  }

  if (cubit.state.value instanceof PageLoaded)
  {
    return (
      <CrudPage.Table>
        <CrudPage.TableBody<PricingMethod, PricingMethodDto>
          data={ cubit.entities.value }
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
