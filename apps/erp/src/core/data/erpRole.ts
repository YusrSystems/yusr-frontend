import type { Signal } from "@preact/signals-react";
import { ChangeableEntityMode, Role, RoleDto } from "yusr-ui";

export class ErpRoleDto extends RoleDto
{
  public authorizedStores!: number[];
}

export class ErpRole extends Role<ErpRoleDto>
{
  public authorizedStores: Signal<number[]>;

  constructor(dto?: Partial<ErpRoleDto> | undefined, mode: ChangeableEntityMode = ChangeableEntityMode.Create)
  {
    super(dto, mode);

    this.authorizedStores = this.assign("authorizedStores", dto?.authorizedStores ?? []);
  }
}
