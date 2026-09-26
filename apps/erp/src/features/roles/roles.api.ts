import { createSimpleListResource } from "yusr-ui";
import { type ErpRoleDto } from "@/core/data/erpRole";


export const erpRolesApi = createSimpleListResource<ErpRoleDto>("Roles");