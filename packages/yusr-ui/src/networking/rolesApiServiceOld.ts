import { type RoleOld } from "../entities/role";
import { BaseApiServiceOld } from "./baseApiServiceOld";

export class RolesApiServiceOld extends BaseApiServiceOld<RoleOld>
{
  routeName: string = "Roles";
}
