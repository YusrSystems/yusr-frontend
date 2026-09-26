import { type RoleDto } from "#/entities";
import { createSimpleListResource, type ISimpleListResource } from "#/api";


export function createRolesApi<TRoleDto extends RoleDto = RoleDto>(): ISimpleListResource<TRoleDto>
{
	return createSimpleListResource<TRoleDto>("Roles");
}

export const rolesApi = createRolesApi<RoleDto>();