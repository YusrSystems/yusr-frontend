import { RolesApiService } from "yusr-core";
import { createGenericEntitySlice } from "yusr-ui";

const { reducer, actions } = createGenericEntitySlice("role", new RolesApiService());

export const { setCurrentPage: setCurrentRolesPage, refresh: refreshRoles, filter: filterRoles } = actions;
export default reducer;
