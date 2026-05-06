import { useSelector } from "react-redux";
import { Branch, BranchesApiService, BranchFilterColumns, type EntitySearchableSelectParams } from "yusr-ui";
import { YusrSystemPermissionsResources } from "../../../auth";
import { BranchSlice } from "../../../entities";
import { ChangeBranchDialog } from "../../../features/branches/changeBranchDialog";
import type { YusrRootState } from "../../../state";
import { ChangableSearchableSelect } from "./changableSearchableSelect";

export function BranchesSearchableSelect(
  { id, disabled, isInvalid, onValueChange }: EntitySearchableSelectParams<Branch>
)
{
  const branchState = useSelector((state: YusrRootState) => state.branch);
  const authState = useSelector((state: YusrRootState) => state.auth);

  return (
    <ChangableSearchableSelect<Branch>
      id={ id }
      itemLabelKey="name"
      itemValueKey="id"
      state={ branchState }
      apiService={ new BranchesApiService() }
      columnsNames={ BranchFilterColumns.columnsNames }
      disabled={ disabled }
      isInvalid={ isInvalid }
      systemPermissionsResources={ YusrSystemPermissionsResources.Branches }
      onValueChange={ onValueChange }
      entityActions={ {
        filter: BranchSlice.entityActions.filter,
        refresh: BranchSlice.entityActions.refresh
      } }
      changeDialog={ ChangeBranchDialog }
      authPermissions={ authState.loggedInUser?.role?.permissions ?? [] }
    />
  );
}
