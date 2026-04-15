import type { Role } from "@/features/roles/data/role";
import { BaseApiService } from "yusr-core";

export default class RolesApiService extends BaseApiService<Role>
{
  routeName: string = "Roles";
}
