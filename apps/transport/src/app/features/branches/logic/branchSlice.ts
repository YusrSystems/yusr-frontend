import { BranchesApiService } from "yusr-ui";
import { createGenericEntitySlice } from "yusr-ui";

const { reducer, actions } = createGenericEntitySlice("branch", new BranchesApiService());

export const { setCurrentPage: setCurrentBranchesPage, refresh: refreshBranches, filter: filterBranches } = actions;
export default reducer;
