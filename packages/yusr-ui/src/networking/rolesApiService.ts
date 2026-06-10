import { Role, type RoleDto } from "../entities/role";
import { BaseApiService } from "./baseApiService";

export abstract class RolesApiService<TRole extends Role<TRoleDto>, TRoleDto extends RoleDto>
  extends BaseApiService<TRole, TRoleDto>
{
  routeName: string = "Roles";
}
