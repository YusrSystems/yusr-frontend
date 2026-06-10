import type { Signal } from "@preact/signals-react";
import { type ChangeableEntityMode, Role, RoleDto } from "yusr-ui";

export class ErpRoleDto extends RoleDto
{
  public authorizedStores!: number[];
}

export class ErpRole extends Role<ErpRoleDto>
{
  declare authorizedStores: Signal<number[]>;

  constructor(dto: Partial<ErpRoleDto>, mode: ChangeableEntityMode = "create")
  {
    super({
      id: 0,
      name: "",
      permissions: [],
      authorizedStores: [],
      ...dto
    }, mode);
  }
}
