import { User2Icon } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { selectPermissionsByResource, SystemPermissions, SystemPermissionsActions, YusrSystemPermissionsResources } from "../../auth";
import { CrudPage } from "../../components/custom";
import { User, UserSlice } from "../../entities";
import { UsersApiService } from "../../networking";
import type { YusrRootState } from "../../state";
import { ChangeUserDialog } from "./changeUserDialog";

export function UsersPage()
{
  const { t } = useTranslation("commonEntities");
  const dispatch = useDispatch();
  const authState = useSelector((state: any) => state.auth);
  const userState = useSelector((state: any) => state.user);
  const userDialogState = useSelector((state: any) => state.userDialog);
  const permissions = useSelector((state: YusrRootState) =>
    selectPermissionsByResource(state, YusrSystemPermissionsResources.Users)
  );
  const service = useMemo(() => new UsersApiService(), []);

  return (
    <CrudPage<User>
      title={ t("users.title") }
      entityName={ t("users.entityName") }
      addNewItemTitle={ t("users.addNewTitle") }
      permissions={ permissions }
      hasPagePermission={ SystemPermissions.hasAuth(
        authState.loggedInUser?.role?.permissions ?? [],
        YusrSystemPermissionsResources.Users,
        SystemPermissionsActions.Get
      ) }
      entityState={ userState }
      useSlice={ () => userDialogState }
      service={ service }
      cards={ [{
        title: t("users.totalUsers"),
        data: (userState.entities?.count ?? 0).toString(),
        icon: <User2Icon className="h-4 w-4 text-muted-foreground" />
      }] }
      tableHeadRows={ [
        { rowName: "", rowStyles: "text-left w-12.5" },
        { rowName: t("users.userId"), rowStyles: "w-30" },
        { rowName: t("users.username"), rowStyles: "w-70" },
        { rowName: t("users.isActive"), rowStyles: "" }
      ] }
      tableRowMapper={ (
        user: User
      ) => [{ rowName: `#${user.id}`, rowStyles: "" }, { rowName: user.username, rowStyles: "font-semibold" }, {
        rowName: user.isActive ? t("users.active") : t("users.inactive"),
        rowStyles: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          user.isActive ? "bg-green-300" : "bg-red-300"
        } text-slate-800`
      }] }
      actions={ {
        filter: UserSlice.entityActions.filter,
        openChangeDialog: (entity) => UserSlice.dialogActions.openChangeDialog(entity),
        openDeleteDialog: (entity) => UserSlice.dialogActions.openDeleteDialog(entity),
        setIsChangeDialogOpen: (open) => UserSlice.dialogActions.setIsChangeDialogOpen(open),
        setIsDeleteDialogOpen: (open) => UserSlice.dialogActions.setIsDeleteDialogOpen(open),
        refresh: UserSlice.entityActions.refresh,
        setCurrentPage: (page) => UserSlice.entityActions.setCurrentPage(page)
      } }
      ChangeDialog={ 
        <ChangeUserDialog
          entity={ userDialogState.selectedRow || undefined }
          mode={ userDialogState.selectedRow ? "update" : "create" }
          service={ service }
          onSuccess={ (data, mode) =>
          {
            dispatch(UserSlice.entityActions.refresh({ data: data }));
            if (mode === "create")
            {
              dispatch(UserSlice.dialogActions.setIsChangeDialogOpen(false));
            }
          } }
        />
       }
    />
  );
}
