import type { Role } from "@/app/features/roles/data/role";
import { BaseApiService } from "yusr-core";

export default class RolesApiService extends BaseApiService<Role>
{
  routeName: string = "Roles";
}
