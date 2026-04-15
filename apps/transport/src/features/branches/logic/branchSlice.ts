import { BranchesApiService } from "yusr-core";
import {  createGenericEntitySlice} from "yusr-ui";
   

const { reducer, actions } = createGenericEntitySlice("branch", new BranchesApiService());

export const { setCurrentPage: setCurrentBranchesPage, refresh: refreshBranches, filter: filterBranches } = actions;
export default reducer;
