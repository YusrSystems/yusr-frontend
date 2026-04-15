import RolesApiService from "@/app/core/networking/rolesApiService";
import { createGenericEntitySlice } from "@yusr_systems/ui";

const { reducer, actions } = createGenericEntitySlice("role", new RolesApiService());

export const { setCurrentPage: setCurrentRolesPage, refresh: refreshRoles, filter: filterRoles } = actions;
export default reducer;
