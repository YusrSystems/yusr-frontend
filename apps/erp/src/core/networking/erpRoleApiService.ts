import { RolesApiService } from "yusr-ui";
import { ErpRole, type ErpRoleDto } from "../data/erpRole";

export class ErpRoleApiService extends RolesApiService<ErpRole, ErpRoleDto>
{
  createEntity(dto: ErpRoleDto): ErpRole
  {
    return new ErpRole(dto);
  }
}
