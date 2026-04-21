import { UsersApiService } from "yusr-core";
import { createGenericEntitySlice } from "yusr-ui";

const { reducer, actions } = createGenericEntitySlice("user", new UsersApiService());

export const { setCurrentPage: setCurrentUsersPage, refresh: refreshUsers, filter: filterUsers } = actions;
export default reducer;
