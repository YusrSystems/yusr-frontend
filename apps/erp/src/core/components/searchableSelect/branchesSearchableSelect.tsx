import ChangeBranchDialog from "@/features/branches/changeBranchDialog";
import { Branch, BranchesApiService, BranchFilterColumns } from "yusr-ui";
import type { EntitySearchableSelectParams } from "yusr-ui";
import ChangableSearchableSelect from "../../../../../../packages/yusr-ui/src/components/custom/select/changableSearchableSelect";
import { SystemPermissionsResources } from "../../auth/systemPermissionsResources";
import { BranchSlice } from "../../data/branchLogic";
import { useAppSelector } from "../../state/store";

export default function BranchesSearchableSelect(
  { id, disabled, isInvalid, onValueChange }: EntitySearchableSelectParams<Branch>
)
{
  const branchState = useAppSelector((state) => state.branch);
  const authState = useAppSelector((state) => state.auth);

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
      systemPermissionsResources={ SystemPermissionsResources.Branches }
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
