import type { UnitDto } from "@/core/data/unit";
import Unit from "@/core/data/unit";
import { Services } from "@/core/services/services";
import { useSignals } from "@preact/signals-react/runtime";
import { BoxIcon } from "lucide-react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { CrudPage, PageCubit, PageError, PageLoaded, PageLoading, SystemPermissionsActions, TablePreview, UnauthorizedPage } from "yusr-ui";
import { SystemPermissionsResources } from "../../core/auth/systemPermissionsResources";
import ChangeUnitDialog from "./changeUnitDialog";

const cubit = new PageCubit<Unit, UnitDto>(Services.unitsApi);

export default function UnitsPage()
{
  if (!Services.auth.hasAuth(SystemPermissionsResources.Units, SystemPermissionsActions.Get))
  {
    return <UnauthorizedPage />;
  }

  const { t } = useTranslation("stocking");

  useEffect(() => cubit.init(), []);

  return (
    <CrudPage>
      <CrudPage.Header
        title={ t("units.title") }
        addButtonTitle={ t("units.addNewTitle") }
        isAddButtonVisible={ Services.auth.hasAuth(SystemPermissionsResources.Units, SystemPermissionsActions.Add) }
      />

      <Cards />

      <CrudPage.SearchInput onSearch={ (searchText) => cubit.search(searchText) } />

      <PageTable />

      <CrudPage.ChangeDialog
        changeDialog={ (dto, closeDialog) =>
        {
          return (
            <ChangeUnitDialog
              entity={ dto
                ? Unit.load(dto)
                : Unit.create() }
              service={ Services.unitsApi }
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
        entityNameSelector={ (unit) => unit.name }
        service={ Services.unitsApi }
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
          title: t("units.totalUnits"),
          data: (cubit.count.value ?? 0).toString(),
          icon: <BoxIcon className="h-4 w-4 text-muted-foreground" />
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
        <CrudPage.TableBody<Unit, UnitDto>
          data={ cubit.entities.value }
          headerRows={ [{ rowBody: "", rowStyles: "text-left w-12.5" }, {
            rowBody: t("units.unitId"),
            rowStyles: "w-30"
          }, { rowBody: t("units.unitName"), rowStyles: "w-70" }] }
          tableRowMapper={ (
            unit
          ) => [{ rowBody: `#${unit.id}`, rowStyles: "" }, { rowBody: unit.name, rowStyles: "font-semibold" }] }
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
