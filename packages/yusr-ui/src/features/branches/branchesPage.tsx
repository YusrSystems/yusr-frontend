import { Building } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { selectPermissionsByResource, SystemPermissions, SystemPermissionsActions, YusrSystemPermissionsResources } from "../../auth";
import { CrudPage } from "../../components/custom";
import { Branch, BranchSlice } from "../../entities";
import { BranchesApiService } from "../../networking";
import type { YusrRootState } from "../../state";
import { ChangeBranchDialog } from "./changeBranchDialog";

export function BranchesPage()
{
  const { t } = useTranslation("commonEntities");
  const dispatch = useDispatch();
  const authState = useSelector((state: YusrRootState) => state.auth);
  const branchState = useSelector((state: YusrRootState) => state.branch);
  const branchDialogState = useSelector((state: YusrRootState) => state.branchDialog);
  const permissions = useSelector((state: YusrRootState) =>
    selectPermissionsByResource(state, YusrSystemPermissionsResources.Branches)
  );
  const service = useMemo(() => new BranchesApiService(), []);

  return (
    <CrudPage<Branch>
      title={ t("branches.title") }
      entityName={ t("branches.entityName") }
      addNewItemTitle={ t("branches.addNewTitle") }
      permissions={ permissions }
      hasPagePermission={ SystemPermissions.hasAuth(
        authState.loggedInUser?.role?.permissions ?? [],
        YusrSystemPermissionsResources.Branches,
        SystemPermissionsActions.Get
      ) }
      entityState={ branchState }
      useSlice={ () => branchDialogState }
      service={ service }
      cards={ [{
        title: t("branches.totalBranches"),
        data: (branchState.entities?.count ?? 0).toString(),
        icon: <Building className="h-4 w-4 text-muted-foreground" />
      }] }
      tableHeadRows={ [
        { rowName: "", rowStyles: "text-left w-12.5" },
        { rowName: t("branches.branchId"), rowStyles: "w-30" },
        { rowName: t("branches.branchName"), rowStyles: "" },
        { rowName: t("branches.city"), rowStyles: "" }
      ] }
      tableRowMapper={ (
        branch: Branch
      ) => [{ rowName: `#${branch.id}`, rowStyles: "" }, { rowName: branch.name, rowStyles: "font-semibold" }, {
        rowName: branch.city?.name,
        rowStyles: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800"
      }] }
      actions={ {
        filter: BranchSlice.entityActions.filter,
        openChangeDialog: (entity) => BranchSlice.dialogActions.openChangeDialog(entity),
        openDeleteDialog: (entity) => BranchSlice.dialogActions.openDeleteDialog(entity),
        setIsChangeDialogOpen: (open) => BranchSlice.dialogActions.setIsChangeDialogOpen(open),
        setIsDeleteDialogOpen: (open) => BranchSlice.dialogActions.setIsDeleteDialogOpen(open),
        refresh: BranchSlice.entityActions.refresh,
        setCurrentPage: (page) => BranchSlice.entityActions.setCurrentPage(page)
      } }
      ChangeDialog={ 
        <ChangeBranchDialog
          entity={ branchDialogState.selectedRow || undefined }
          mode={ branchDialogState.selectedRow ? "update" : "create" }
          service={ service }
          onSuccess={ (data, mode) =>
          {
            dispatch(BranchSlice.entityActions.refresh({ data: data }));
            if (mode === "create")
            {
              dispatch(BranchSlice.dialogActions.setIsChangeDialogOpen(false));
            }
          } }
        />
       }
    />
  );
}
