import type { Signal } from "@preact/signals-react";
import { type ChangeableEntityMode, Role, RoleDto } from "yusr-ui";

export class ErpRoleDto extends RoleDto
{
  public authorizedStores!: number[];
}

export class ErpRole extends Role<ErpRoleDto>
{
  protected initialValue(dto?: Partial<ErpRoleDto> | undefined): ErpRoleDto
  {
    return {
      id: 0,
      name: "",
      permissions: [],
      authorizedStores: [],
      ...dto
    };
  }
  public authorizedStores: Signal<number[]>;

  constructor(dto: ErpRoleDto, mode: ChangeableEntityMode = "create")
  {
    super(dto, mode);

    this.authorizedStores = this.assign("authorizedStores", dto.authorizedStores ?? []);
  }
}
