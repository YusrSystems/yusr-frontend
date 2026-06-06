import { useSelector } from "react-redux";
import { YusrSystemPermissionsResources } from "../../../auth";
import { BranchOld, BranchSlice } from "../../../entities";
import { ChangeBranchDialogOld } from "../../../features/branches/changeBranchDialogOld";
import { BranchesApiServiceOld } from "../../../networking";
import type { YusrRootState } from "../../../state";
import { ChangableSearchableSelect } from "./changableSearchableSelect";
import type { BasicSearchableSelectParamsOld } from "./searchableSelectOld";

export function BranchesSearchableSelectOld(
  { ...props }: BasicSearchableSelectParamsOld<BranchOld>
)
{
  const branchState = useSelector((state: YusrRootState) => state.branch);
  const authState = useSelector((state: YusrRootState) => state.auth);

  return (
    <ChangableSearchableSelect<BranchOld>
      labelKey="name"
      createKey="name"
      state={ branchState }
      apiService={ new BranchesApiServiceOld() }
      systemPermissionsResources={ YusrSystemPermissionsResources.Branches }
      entityActions={ {
        filter: BranchSlice.entityActions.filter,
        refresh: BranchSlice.entityActions.refresh
      } }
      changeDialog={ ChangeBranchDialogOld }
      authPermissions={ authState.loggedInUser?.role?.permissions ?? [] }
      { ...props }
    />
  );
}
