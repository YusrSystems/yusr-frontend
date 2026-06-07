import { Role, type RoleDto, type RoleOld } from "../entities/role";
import { BaseApiServiceOld } from "./baseApiServiceOld";
import { BaseFilterableApiService } from "./baseFilterableApiService";

export class RolesApiServiceOld extends BaseApiServiceOld<RoleOld>
{
  routeName: string = "Roles";
}

export class RolesApiService extends BaseFilterableApiService<Role, RoleDto>
{
  routeName: string = "Roles";

  createEntity(dto: RoleDto): Role
  {
    return new Role(dto);
  }
}
