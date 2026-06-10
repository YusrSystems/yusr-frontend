import { useSignals } from "@preact/signals-react/runtime";
import { Settings2 } from "lucide-react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { SystemPermissionsActions, YusrSystemPermissionsResources } from "../../auth";
import { CrudPage, TablePreview, UnauthorizedPage } from "../../components/custom";
import type { Role, RoleDto } from "../../entities";
import type { RolesApiService } from "../../networking";
import { BaseServices } from "../../services";
import { PageCubit, PageError, PageLoaded, PageLoading } from "../../stateManager";
import { ChangeRoleDialog } from "./changeRoleDialog";

export function RolesPage<TRole extends Role<TRoleDto>, TRoleDto extends RoleDto>(
  { rolesApiService, cubit, toEntity, ...props }: ChangeRoleDialog<TRole, TRoleDto> & {
    rolesApiService: RolesApiService<TRole, TRoleDto>;
    cubit: PageCubit<TRole, TRoleDto>;
  } & {
    toEntity: (dto?: TRoleDto) => TRole;
  }
)
{
  const { t } = useTranslation("commonEntities");

  if (!BaseServices.auth.hasAuth(YusrSystemPermissionsResources.Roles, SystemPermissionsActions.Get))
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
        title={ t("roles.title") }
        addButtonTitle={ t("roles.addNewTitle") }
        isAddButtonVisible={ BaseServices.auth.hasAuth(
          YusrSystemPermissionsResources.Roles,
          SystemPermissionsActions.Add
        ) }
      />

      <RoleCards cubit={ cubit } />

      <CrudPage.SearchInput onSearch={ (searchText) => cubit.search(searchText) } />

      <RoleTable cubit={ cubit } />

      <CrudPage.ChangeDialog
        changeDialog={ (dto: TRoleDto | undefined, closeDialog) =>
        {
          return (
            <ChangeRoleDialog
              entity={ toEntity(dto) }
              service={ rolesApiService }
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
              { ...props }
            />
          );
        } }
      />

      <CrudPage.DeleteDialog
        entityNameSelector={ (entity) => entity.name }
        service={ rolesApiService }
        onSuccess={ (entity) => cubit.delete(entity) }
      />
    </CrudPage>
  );
}

function RoleCards<TRole extends Role<TRoleDto>, TRoleDto extends RoleDto>(
  { cubit }: { cubit: PageCubit<TRole, TRoleDto>; }
)
{
  useSignals();
  const { t } = useTranslation("commonEntities");
  return (
    <CrudPage.Cards
      cards={ [{
        title: t("roles.totalRoles"),
        data: cubit.count.value.toString(),
        icon: <Settings2 className="h-4 w-4 text-muted-foreground" />
      }] }
    />
  );
}

function RoleTable<TRole extends Role<TRoleDto>, TRoleDto extends RoleDto>(
  { cubit }: { cubit: PageCubit<TRole, TRoleDto>; }
)
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
        <CrudPage.TableBody<TRole, TRoleDto>
          data={ cubit.entities.value }
          headerRows={ [{ rowBody: "", rowStyles: "text-left w-12.5" }, {
            rowBody: t("roles.roleId"),
            rowStyles: "w-30"
          }, { rowBody: t("roles.roleName"), rowStyles: "" }] }
          tableRowMapper={ (
            role
          ) => [{ rowBody: `#${role.id}`, rowStyles: "" }, { rowBody: role.name, rowStyles: "font-semibold" }] }
          hasUpdatePermission={ BaseServices.auth.hasAuth(
            YusrSystemPermissionsResources.Roles,
            SystemPermissionsActions.Update
          ) }
          hasDeletePermission={ BaseServices.auth.hasAuth(
            YusrSystemPermissionsResources.Roles,
            SystemPermissionsActions.Delete
          ) }
        />
        <CrudPage.TablePagination
          pageSize={ cubit.pageSize.value }
          totalNumber={ cubit.count.value }
          currentPage={ cubit.currentPage.value }
          onPageChanged={ (newPage) => cubit.changePage(newPage) }
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
