import { BranchDto } from "yusr-ui";
import { createSimpleListResource } from "#/api";


export const branchesApi = createSimpleListResource<BranchDto>("Branches");