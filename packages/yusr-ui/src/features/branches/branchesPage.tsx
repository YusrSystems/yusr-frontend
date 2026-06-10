import { useSignals } from "@preact/signals-react/runtime";
import { Building } from "lucide-react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { SystemPermissionsActions, YusrSystemPermissionsResources } from "../../auth";
import { CrudPage, TablePreview, UnauthorizedPage } from "../../components/custom";
import { Branch, type BranchDto } from "../../entities";
import { BaseServices } from "../../services/baseServices";
import { PageCubit, PageError, PageLoaded, PageLoading } from "../../stateManager";
import { ChangeBranchDialog } from "./changeBranchDialog";

const cubit = new PageCubit<Branch, BranchDto>(BaseServices.branchesApi);

export function BranchesPage({ onUpdate }: { onUpdate?: (entity: Branch) => void; })
{
  const { t } = useTranslation("commonEntities");

  if (!BaseServices.auth.hasAuth(YusrSystemPermissionsResources.Branches, SystemPermissionsActions.Get))
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
        title={ t("branches.title") }
        addButtonTitle={ t("branches.addNewTitle") }
        isAddButtonVisible={ BaseServices.auth.hasAuth(
          YusrSystemPermissionsResources.Branches,
          SystemPermissionsActions.Add
        ) }
      />

      <Cards />

      <CrudPage.SearchInput onSearch={ (searchText) => cubit.search(searchText) } />

      <PageTable />

      <CrudPage.ChangeDialog
        changeDialog={ (dto) =>
        {
          return (
            <ChangeBranchDialog
              entity={ dto
                ? Branch.load(dto)
                : Branch.create() }
              service={ BaseServices.branchesApi }
              onSuccess={ (data) =>
              {
                if (data.mode.value === "create")
                {
                  cubit.add(data);
                }
                else if (data.mode.value === "update")
                {
                  cubit.update(data);
                  onUpdate?.(data);
                }
              } }
            />
          );
        } }
      />

      <CrudPage.DeleteDialog
        entityNameSelector={ (entity) => entity.name }
        service={ BaseServices.branchesApi }
        onSuccess={ (entity) => cubit.delete(entity) }
      />
    </CrudPage>
  );
}

function Cards()
{
  useSignals();
  const { t } = useTranslation("commonEntities");
  return (
    <CrudPage.Cards
      cards={ [{
        title: t("branches.totalBranches"),
        data: cubit.count.value.toString(),
        icon: <Building className="h-4 w-4 text-muted-foreground" />
      }] }
    />
  );
}

function PageTable()
{
  useSignals();
  const { t } = useTranslation(["commonEntities", "common"]);

  if (cubit.state.value instanceof PageLoading)
  {
    return <TablePreview.Loading />;
  }

  if (cubit.state.value instanceof PageLoaded)
  {
    return (
      <CrudPage.Table>
        <CrudPage.TableBody<Branch, BranchDto>
          data={ cubit.entities.value }
          headerRows={ [
            { rowBody: "", rowStyles: "text-left w-12.5" },
            { rowBody: t("branches.branchId"), rowStyles: "w-30" },
            { rowBody: t("branches.branchName"), rowStyles: "w-50" },
            { rowBody: t("branches.city"), rowStyles: "w-50" }
          ] }
          tableRowMapper={ (
            branch
          ) => [{ rowBody: `#${branch.id}`, rowStyles: "" }, { rowBody: branch.name, rowStyles: "font-semibold" }, {
            rowBody: branch.cityName,
            rowStyles:
              "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800"
          }] }
          hasUpdatePermission={ BaseServices.auth.hasAuth(
            YusrSystemPermissionsResources.Branches,
            SystemPermissionsActions.Update
          ) }
          hasDeletePermission={ BaseServices.auth.hasAuth(
            YusrSystemPermissionsResources.Branches,
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
