import { type RoleDto } from "#/entities";
import { BaseApiService } from "./baseApiService";


export class RolesApiService<TRoleDto extends RoleDto> extends BaseApiService<TRoleDto>
{
	constructor()
	{
		super("Roles");
	}
}
