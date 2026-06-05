import { useSelector } from "react-redux";
import { YusrSystemPermissionsResources } from "../../../auth";
import { Branch, BranchSlice } from "../../../entities";
import { ChangeBranchDialog } from "../../../features/branches/changeBranchDialog";
import { BranchesApiService } from "../../../networking";
import type { YusrRootState } from "../../../state";
import { ChangableSearchableSelect } from "./changableSearchableSelect";
import type { BasicSearchableSelectParamsOld } from "./searchableSelectOld";

export function BranchesSearchableSelect(
  { ...props }: BasicSearchableSelectParamsOld<Branch>
)
{
  const branchState = useSelector((state: YusrRootState) => state.branch);
  const authState = useSelector((state: YusrRootState) => state.auth);

  return (
    <ChangableSearchableSelect<Branch>
      labelKey="name"
      createKey="name"
      state={ branchState }
      apiService={ new BranchesApiService() }
      systemPermissionsResources={ YusrSystemPermissionsResources.Branches }
      entityActions={ {
        filter: BranchSlice.entityActions.filter,
        refresh: BranchSlice.entityActions.refresh
      } }
      changeDialog={ ChangeBranchDialog }
      authPermissions={ authState.loggedInUser?.role?.permissions ?? [] }
      { ...props }
    />
  );
}
