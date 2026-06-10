import { useSignals } from "@preact/signals-react/runtime";
import { Building } from "lucide-react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { SystemPermissionsActions, YusrSystemPermissionsResources } from "../../auth";
import { CrudPage, TablePreview, UnauthorizedPage } from "../../components/custom";
import { Branch, type BranchDto } from "../../entities";
import { BaseCubits } from "../../services";
import { BaseServices } from "../../services/baseServices";
import { PageError, PageLoaded, PageLoading } from "../../stateManager";
import { ChangeBranchDialog } from "./changeBranchDialog";

export function BranchesPage({ onUpdate }: { onUpdate?: (entity: Branch) => void; })
{
  const { t } = useTranslation("commonEntities");

  if (!BaseServices.auth.hasAuth(YusrSystemPermissionsResources.Branches, SystemPermissionsActions.Get))
  {
    return <UnauthorizedPage />;
  }

  useEffect(() =>
  {
    BaseCubits.branches.init();
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

      <CrudPage.SearchInput onSearch={ (searchText) => BaseCubits.branches.search(searchText) } />

      <PageTable />

      <CrudPage.ChangeDialog
        changeDialog={ (dto: BranchDto | undefined) =>
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
                  BaseCubits.branches.add(data);
                }
                else if (data.mode.value === "update")
                {
                  BaseCubits.branches.update(data);
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
        onSuccess={ (entity) => BaseCubits.branches.delete(entity) }
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
        data: BaseCubits.branches.count.value.toString(),
        icon: <Building className="h-4 w-4 text-muted-foreground" />
      }] }
    />
  );
}

function PageTable()
{
  useSignals();
  const { t } = useTranslation(["commonEntities", "common"]);

  if (BaseCubits.branches.state.value instanceof PageLoading)
  {
    return <TablePreview.Loading />;
  }

  if (BaseCubits.branches.state.value instanceof PageLoaded)
  {
    return (
      <CrudPage.Table>
        <CrudPage.TableBody<Branch, BranchDto>
          data={ BaseCubits.branches.entities.value }
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
          pageSize={ BaseCubits.branches.pageSize.value }
          totalNumber={ BaseCubits.branches.count.value }
          currentPage={ BaseCubits.branches.currentPage.value }
          onPageChanged={ (newPage) =>
          {
            BaseCubits.branches.changePage(newPage);
          } }
        />
      </CrudPage.Table>
    );
  }

  if (BaseCubits.branches.state.value instanceof PageError)
  {
    return <TablePreview.Error />;
  }

  return <TablePreview.Empty />;
}
