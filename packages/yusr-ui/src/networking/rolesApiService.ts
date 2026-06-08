import { Role, type RoleDto, type RoleOld } from "../entities/role";
import { BaseApiService } from "./baseApiService";
import { BaseApiServiceOld } from "./baseApiServiceOld";

export class RolesApiServiceOld extends BaseApiServiceOld<RoleOld>
{
  routeName: string = "Roles";
}

export abstract class RolesApiService<TRole extends Role<TRoleDto>, TRoleDto extends RoleDto>
  extends BaseApiService<TRole, TRoleDto>
{
  routeName: string = "Roles";
}
