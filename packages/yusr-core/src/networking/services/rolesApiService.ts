import type { Role } from "../../entities";
import { BaseApiService } from "./baseApiService";

export class RolesApiService extends BaseApiService<Role>
{
  routeName: string = "Roles";
}
