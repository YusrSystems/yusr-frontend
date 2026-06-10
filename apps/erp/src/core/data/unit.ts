import type { Signal } from "@preact/signals-react";
import { ChangeableEntity, type ChangeableEntityMode, Dto, i18n, Validators } from "yusr-ui";

export class UnitDto extends Dto
{
  public name!: string;
}

export default class Unit extends ChangeableEntity<UnitDto>
{
  protected initialValue(dto?: Partial<UnitDto> | undefined): UnitDto
  {
    return { id: 0, name: "", ...dto };
  }
  
  declare name: Signal<string>;

  constructor(dto: UnitDto, mode: ChangeableEntityMode = "create")
  {
    super(dto, [{
      field: "name",
      selector: (d) => d.name,
      validators: [Validators.required(i18n.t("stocking:units.nameRequired"))]
    }], mode);
  }
}
