import type { Role } from "../entities";
import { BaseApiServiceOld } from "./baseApiServiceOld";

export class RolesApiService extends BaseApiServiceOld<Role>
{
  routeName: string = "Roles";
}
