import { selectPermissionsByResource } from "@/app/core/auth/authSelectors";
import { SystemPermissionsResources } from "@/app/core/auth/systemPermissionsResources";
import BranchesApiService from "@/app/core/networking/branchesApiService";
import { useAppDispatch, useAppSelector } from "@/app/core/state/store";
import Branch, { BranchFilterColumns } from "@/app/features/branches/data/branch";
import { openBranchChangeDialog, openBranchDeleteDialog, setIsBranchChangeDialogOpen, setIsBranchDeleteDialogOpen } from "@/app/features/branches/logic/branchDialogSlice";
import { filterBranches, refreshBranches, setCurrentBranchesPage } from "@/app/features/branches/logic/branchSlice";
import { CrudPage } from "yusr-ui";
import { Building, MapPin } from "lucide-react";
import { useMemo } from "react";
import ChangeBranchDialog from "./changeBranchDialog";

export default function BranchesPage() {
  const dispatch = useAppDispatch();
  const branchState = useAppSelector((state) => state.branch);
  const branchDialogState = useAppSelector((state) => state.branchDialog);
  const permissions = useAppSelector((state) =>
    selectPermissionsByResource(state, SystemPermissionsResources.Branches)
  );
  const service = useMemo(() => new BranchesApiService(), []);

  return (
    <CrudPage<Branch>
      title="إدارة الفروع"
      entityName="الفرع"
      addNewItemTitle="إضافة فرع جديد"
      permissions={permissions}
      entityState={branchState}
      useSlice={() => branchDialogState}
      service={service}
      cards={[{
        title: "إجمالي الفروع",
        data: (branchState.entities?.count ?? 0).toString(),
        icon: <Building className="h-4 w-4 text-muted-foreground" />
      }, { title: "المدن المغطاة", data: (4).toString(), icon: <MapPin className="h-4 w-4 text-muted-foreground" /> }]}
      columnsToFilter={BranchFilterColumns.columnsNames}
      tableHeadRows={[{ rowName: "", rowStyles: "text-left w-12.5" }, { rowName: "رقم الفرع", rowStyles: "w-30" }, {
        rowName: "اسم الفرع",
        rowStyles: ""
      }, { rowName: "المدينة", rowStyles: "" }]}
      tableRowMapper={(
        branch: Branch
      ) => [{ rowName: `#${branch.id}`, rowStyles: "" }, { rowName: branch.name, rowStyles: "font-semibold" }, {
        rowName: branch.cityName,
        rowStyles: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800"
      }]}
      actions={{
        filter: filterBranches,
        openChangeDialog: (entity) => openBranchChangeDialog(entity),
        openDeleteDialog: (entity) => openBranchDeleteDialog(entity),
        setIsChangeDialogOpen: (open) => setIsBranchChangeDialogOpen(open),
        setIsDeleteDialogOpen: (open) => setIsBranchDeleteDialogOpen(open),
        refresh: refreshBranches,
        setCurrentPage: (page) => setCurrentBranchesPage(page)
      }}
      ChangeDialog={
        <ChangeBranchDialog
          entity={branchDialogState.selectedRow || undefined}
          mode={branchDialogState.selectedRow ? "update" : "create"}
          service={service}
          onSuccess={(data, mode) => {
            dispatch(refreshBranches({ data: data }));
            if (mode === "create") {
              dispatch(setIsBranchChangeDialogOpen(false));
            }
          }}
        />
      }
    />
  );
}
