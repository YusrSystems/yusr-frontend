import type { Role } from "../entities/role";
import { BaseApiServiceOld } from "./baseApiServiceOld";

export class RolesApiService extends BaseApiServiceOld<Role>
{
  routeName: string = "Roles";
}
