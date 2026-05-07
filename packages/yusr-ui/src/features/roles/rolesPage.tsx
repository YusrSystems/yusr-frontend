import { Settings2 } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { selectPermissionsByResource, SystemPermissions, SystemPermissionsActions, YusrSystemPermissionsResources } from "../../auth";
import { CrudPage } from "../../components/custom";
import { type Role, RoleFilterColumns, RoleSlice, User } from "../../entities";
import { RolesApiService } from "../../networking";
import { useAppDispatch, type YusrRootState } from "../../state";
import { ChangeRoleDialog, type ChangeRoleDialogAdditionalProps } from "./changeRoleDialog";

type RolesPageProps = {
  onUpdateLoggedInUser?: (user: Partial<User>) => void;
  ChangeRoleDialogAdditionalProps: ChangeRoleDialogAdditionalProps;
};

export function RolesPage({ onUpdateLoggedInUser, ChangeRoleDialogAdditionalProps }: RolesPageProps)
{
  const { t } = useTranslation("commonEntities");
  const dispatch = useAppDispatch();
  const authState = useSelector((state: YusrRootState) => state.auth);
  const roleState = useSelector((state: YusrRootState) => state.role);
  const roleDialogState = useSelector((state: YusrRootState) => state.roleDialog);
  const permissions = useSelector((state: YusrRootState) =>
    selectPermissionsByResource(state, YusrSystemPermissionsResources.Roles)
  );
  const service = useMemo(() => new RolesApiService(), []);

  return (
    <CrudPage<Role>
      title={ t("roles.title") }
      entityName={ t("roles.entityName") }
      addNewItemTitle={ t("roles.addNewTitle") }
      permissions={ permissions }
      hasPagePermission={ SystemPermissions.hasAuth(
        authState.loggedInUser?.role?.permissions ?? [],
        YusrSystemPermissionsResources.Roles,
        SystemPermissionsActions.Get
      ) }
      entityState={ roleState }
      useSlice={ () => roleDialogState }
      service={ service }
      cards={ [{
        title: t("roles.totalRoles"),
        data: (roleState.entities?.count ?? 0).toString(),
        icon: <Settings2 className="h-4 w-4 text-muted-foreground" />
      }] }
      columnsToFilter={ RoleFilterColumns.columnsNames }
      tableHeadRows={ [{ rowName: "", rowStyles: "text-left w-12.5" }, {
        rowName: t("roles.roleId"),
        rowStyles: "w-30"
      }, { rowName: t("roles.roleName"), rowStyles: "" }] }
      tableRowMapper={ (
        role: Role
      ) => [{ rowName: `#${role.id}`, rowStyles: "" }, { rowName: role.name, rowStyles: "font-semibold" }] }
      actions={ {
        filter: RoleSlice.entityActions.filter,
        openChangeDialog: (entity) => RoleSlice.dialogActions.openChangeDialog(entity),
        openDeleteDialog: (entity) => RoleSlice.dialogActions.openDeleteDialog(entity),
        setIsChangeDialogOpen: (open) => RoleSlice.dialogActions.setIsChangeDialogOpen(open),
        setIsDeleteDialogOpen: (open) => RoleSlice.dialogActions.setIsDeleteDialogOpen(open),
        refresh: RoleSlice.entityActions.refresh,
        setCurrentPage: (page) => RoleSlice.entityActions.setCurrentPage(page)
      } }
      ChangeDialog={ 
        <ChangeRoleDialog
          { ...ChangeRoleDialogAdditionalProps }
          entity={ roleDialogState.selectedRow || undefined }
          mode={ roleDialogState.selectedRow ? "update" : "create" }
          service={ service }
          onSuccess={ (data, mode) =>
          {
            dispatch(RoleSlice.entityActions.refresh({ data: data }));
            if (mode === "create")
            {
              dispatch(RoleSlice.dialogActions.setIsChangeDialogOpen(false));
            }
            if (mode === "update")
            {
              if (authState.loggedInUser?.roleId === data.id)
              {
                onUpdateLoggedInUser?.({ ...authState.loggedInUser, role: data });
              }
            }
          } }
        />
       }
    />
  );
}
