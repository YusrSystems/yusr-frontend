import { BranchesApiServiceOld, createGenericEntitySlice } from "yusr-ui";

const { reducer, actions } = createGenericEntitySlice("branch", new BranchesApiServiceOld());

export const { setCurrentPage: setCurrentBranchesPage, refresh: refreshBranches, filter: filterBranches } = actions;
export default reducer;
